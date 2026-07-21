// All DOM references, render functions, event listeners.
// Owns: uiLocale, notifEnabled, isDark. Reads timer state via live bindings.
import { LINES, UI_STRINGS, VERSION, BUILD, BUILD_DATE } from './data.js';
import {
  t as tUtil,
  normalizeLineKey,
  getStatusCopyFor,
  fmt,
  fmtOvertime,
  fmtDuration,
  workProg as workProgCalc,
  totalProg as totalProgCalc,
  syncRoute
} from './util.js';
import { trackEvent, chimeGo } from './audio.js';
import { paEnabled as paEnabledRead, setPaEnabled } from './timer.js';
import { updStatsUI, startRolloverChecker } from './stats.js';
import {
  currentLine, timeMode, cfg, timeLeft, running, phase,
  hasStarted, overtime, overtimeSeconds, currentJourney, clockTicker,
  setCurrentLine, setTimeMode, setHasStarted, setTimeLeft, setPhase,
  setClockTicker, startTimer, pauseTimer, fullReset, applyCfg,
  advancePhase, addWorkFromPhase
} from './timer.js';

// UI-owned state
export let uiLocale = 'ja';
export let notifEnabled = false;
export let isDark = false;

// Cache de referencias a estaciones (se llena en buildStations, se consume en
// updStations). Evita querySelectorAll cada tick.
let stationEls = [];

// Setters for UI state
export function setUiLocale(next){ uiLocale = next; }
export function setNotifEnabled(next){ notifEnabled = next; }
export function setIsDark(next){ isDark = next; }

// Re-export t with current uiLocale bound for callers that don't want to
// pass the locale explicitly.
export function t(key){
  return tUtil(key, uiLocale);
}

// DOM references
const timerEl = document.getElementById('timer');
const statusTextEl = document.getElementById('statusText');
const statusIconEl = document.getElementById('statusIcon');
const tpEl = document.getElementById('trackProgress');
const trainInd = document.getElementById('trainIndicator');
const lineBtn = document.getElementById('lineBtn');
const lineDropdown = document.getElementById('lineDropdown');
const lineNameJp = document.getElementById('lineNameJp');
const lineNameEn = document.getElementById('lineNameEn');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const startIconEl = startBtn.querySelector('.ctrl-icon');
const startLabelEl = startBtn.querySelector('span:last-child');
const trackEl = document.getElementById('track');
const lineOptions = document.querySelectorAll('.line-option');

export function detectLocale(){
  const saved = localStorage.getItem('futsuUiLocale');
  if(saved && UI_STRINGS[saved]) return saved;
  const lang = (navigator.language || 'ja').toLowerCase();
  if(lang.startsWith('es')) return 'es';
  if(lang.startsWith('en')) return 'en';
  if(lang.startsWith('it')) return 'it';
  if(lang.startsWith('de')) return 'de';
  if(lang.startsWith('hi')) return 'hi';
  if(lang.startsWith('fr')) return 'fr';
  if(lang.startsWith('sv')) return 'sv';
  if(lang.startsWith('pt')) return 'pt';
  return 'ja';
}

export function applyUIText(){
  const set = (id, val) => {
    const el = document.getElementById(id);
    if(el) el.textContent = val;
  };
  set('resetBtnLabel', t('reset'));
  set('tabStats', t('tabStats'));
  set('tabTrip', t('tabTrip'));
  set('tabSettings', t('tabSettings'));
  set('tabAbout', t('tabAbout'));
  set('titleTravelLog', t('travelLog'));
  set('labelStops', t('stops'));
  set('labelToday', t('today'));
  set('labelAllTime', t('allTime'));
  set('labelMinA', t('min'));
  set('labelMinB', t('min'));
  set('titleTripConfig', t('tripConfig'));
  set('labelStopsCfg', t('stops'));
  set('labelWork', t('work'));
  set('labelBreak', t('break'));
  set('labelLongRest', t('longRest'));
  set('titleSettings', t('systemSettings'));
  set('labelMode', t('mode'));
  set('labelNotifications', t('notifications'));
  set('labelTheme', t('theme'));
  set('labelLanguage', t('language'));
  set('aboutText1', t('about1'));
  set('aboutText2', t('about2'));
  set('aboutText3', t('about3'));
  const about4El = document.getElementById('aboutText4');
  if(about4El){
    about4El.innerHTML = t('about4').replace(
      '{anhdres}',
      '<a href="https://anhdres.com" target="_blank" rel="noopener noreferrer">anhdres</a>'
    );
  }
  const langSelect = document.getElementById('langSelect');
  if(langSelect) langSelect.value = uiLocale;
  refreshThemeButton();
  updNotifBtn();
  updTripDurationNote();
  updBtns();
  updVersionInfo();
  // Actualizar <html lang> y <title> para a11y + SEO en el idioma activo.
  document.documentElement.lang = uiLocale;
  document.title = 'Futsudoro — ' + t('travelLog');
}

export function setLocale(next){
  if(!UI_STRINGS[next]) return;
  setUiLocale(next);
  try { localStorage.setItem('futsuUiLocale', next); } catch(_e){}
  applyUIText();
}

export function selectLine(lineKey){
  const next = normalizeLineKey(lineKey);
  // Si hay un viaje en curso, pedimos confirmación para no perder progreso
  // por un click accidental en el dropdown.
  if(hasStarted && next !== currentLine){
    const ok = window.confirm(t('confirmSwitchLine') || 'Switch line and reset the current session?');
    if(!ok) return;
  }
  setCurrentLine(next);
  const line = LINES[currentLine];
  trackEvent('Line Changed', { line: currentLine });
  syncRoute(currentLine, timeMode);
  lineNameJp.textContent = line.nameJp;
  lineNameEn.textContent = line.nameEn;
  // Update train color
  trainInd.className = 'train-indicator ' + line.color;
  // Update dropdown selection
  lineOptions.forEach(opt => {
    opt.classList.toggle('selected', normalizeLineKey(opt.dataset.line) === currentLine);
  });
  lineDropdown.classList.remove('open');
  lineBtn.setAttribute('aria-expanded', 'false');
  // Reset with new stations
  fullReset();
}

export function buildStations(){
  trackEl.querySelectorAll('.station').forEach(e => e.remove());
  stationEls = [];
  const n = cfg.journeys + 1;
  const safeLine = LINES[normalizeLineKey(currentLine)] || LINES.yamanote;
  const stations = safeLine.stations;
  stations.slice(0, n).forEach((st, i) => {
    const d = document.createElement('div');
    d.className = 'station';
    d.innerHTML = '<div class="station-dot"></div><div class="station-name"><span class="station-name-jp">' + st.jp + '</span>' + (st.en ? '<span class="station-name-en">' + st.en + '</span>' : '') + '</div>';
    trackEl.appendChild(d);
    stationEls.push(d);
  });
}

export function updStations(){
  for(let i = 0; i < stationEls.length; i++){
    const el = stationEls[i];
    el.classList.remove('active', 'done');

    if(!hasStarted){
      if(i === currentJourney) el.classList.add('active');
      continue;
    }

    if(i < currentJourney || (phase === 'work' && i === currentJourney)){
      el.classList.add('done');
    } else if(i === currentJourney && phase !== 'work'){
      el.classList.add('active');
    }
  }
}

export function updTrainState(){
  if(phase === 'work' && running){
    trainInd.classList.add('moving');
    trainInd.classList.remove('doors-open');
  } else {
    trainInd.classList.remove('moving');
    trainInd.classList.add('doors-open');
  }
}

export function updAnalogClock(){
  const now = new Date();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360;

  document.getElementById('secondHand').style.transform = 'rotate(' + secondDeg + 'deg)';
  document.getElementById('minuteHand').style.transform = 'rotate(' + minuteDeg + 'deg)';
  document.getElementById('hourHand').style.transform = 'rotate(' + hourDeg + 'deg)';
}

export function updDisplay(){
  timerEl.textContent = (timeMode === 'kairos' && overtime)
    ? fmtOvertime(overtimeSeconds)
    : fmt(timeLeft);
  if(phase === 'work'){
    const pct = totalProgCalc(cfg, timeLeft, currentJourney) * 100;
    tpEl.style.width = pct + '%';
    tpEl.setAttribute('aria-valuenow', Math.round(pct));
  } else if(phase === 'longrest'){
    tpEl.style.width = '100%';
    tpEl.setAttribute('aria-valuenow', '100');
  } else if(!hasStarted){
    tpEl.style.width = '0%';
    tpEl.setAttribute('aria-valuenow', '0');
  }
  updTrainState();

  if(!hasStarted || phase === 'rest' || phase === 'longrest'){
    const copy = getStatusCopyFor(currentLine, currentJourney, false);
    statusTextEl.textContent = copy.main;
    statusTextEl.classList.add('status-station');
    statusTextEl.classList.remove('status-transit');
    statusIconEl.textContent = 'subway_walk';
    statusIconEl.classList.add('status-station');
    statusIconEl.classList.remove('status-transit');
  } else if(phase === 'work'){
    const copy = getStatusCopyFor(currentLine, currentJourney, true);
    statusTextEl.textContent = copy.main;
    statusTextEl.classList.add('status-transit');
    statusTextEl.classList.remove('status-station');
    statusIconEl.textContent = 'directions_subway';
    statusIconEl.classList.add('status-transit');
    statusIconEl.classList.remove('status-station');
  }

  updStations();
  updStatsUI();
}

export function updBtns(){
  const waitingKairos = timeMode === 'kairos' && overtime;
  const pausedState = !running && hasStarted && !waitingKairos;
  startBtn.disabled = false;
  startBtn.classList.toggle('ready', waitingKairos);
  startBtn.classList.toggle('start', running && !waitingKairos);
  startBtn.classList.toggle('paused-state', pausedState);

  if(waitingKairos){
    startIconEl.textContent = 'fast_forward';
    startLabelEl.textContent = (phase === 'work') ? t('next') : t('resume');
    return;
  }

  if(pausedState){
    startIconEl.textContent = 'pause';
    startLabelEl.textContent = t('paused');
  } else if(running){
    startIconEl.textContent = 'pause';
    startLabelEl.textContent = t('stop');
  } else {
    startIconEl.textContent = 'play_arrow';
    startLabelEl.textContent = t('start');
  }
}

export function fmtTripDuration(){
  const totalToFinalRest = (cfg.work * cfg.journeys) + (cfg.rest * Math.max(0, cfg.journeys - 1));
  return fmtDuration(totalToFinalRest);
}

export function updTripDurationNote(){
  const note = document.getElementById('tripDurationNote');
  if(note) note.textContent = t('tripDuration').replace('{duration}', fmtTripDuration());
}

export function refreshThemeButton(){
  const btn = document.getElementById('themeBtn');
  btn.textContent = isDark ? t('dark') : t('light');
  btn.classList.toggle('on', isDark);
}

export function loadTheme(){
  try {
    if(localStorage.getItem('futsuTheme') === 'dark'){
      setIsDark(true);
      document.body.classList.add('dark');
    }
  } catch(_e){}
  refreshThemeButton();
}

export function toggleTheme(){
  setIsDark(!isDark);
  document.body.classList.toggle('dark', isDark);
  refreshThemeButton();
  try { localStorage.setItem('futsuTheme', isDark ? 'dark' : 'light'); } catch(_e){}
}

export function updModeBtn(){
  const b = document.getElementById('modeBtn');
  b.textContent = timeMode === 'kairos' ? 'Kairos' : 'Chronos';
  b.classList.toggle('on', timeMode === 'kairos');
}

export function loadMode(){
  try {
    const saved = localStorage.getItem('futsuTimeMode');
    if(saved === 'kairos' || saved === 'chronos') setTimeMode(saved);
  } catch(_e){}
  updModeBtn();
}

export function toggleMode(){
  setTimeMode(timeMode === 'chronos' ? 'kairos' : 'chronos');
  try { localStorage.setItem('futsuTimeMode', timeMode); } catch(_e){}
  syncRoute(currentLine, timeMode);
  fullReset();
  updModeBtn();
}

export function updNotifBtn(){
  const b = document.getElementById('notifBtn');
  b.textContent = notifEnabled ? t('notifOn') : t('notifOff');
  b.classList.toggle('on', notifEnabled);
}

export function loadNotif(){
  if('Notification' in window){
    try {
      if(localStorage.getItem('futsuNotif') && Notification.permission === 'granted'){
        setNotifEnabled(true);
      }
    } catch(_e){}
  }
}

export async function toggleNotif(){
  if(!('Notification' in window)) return;
  if(notifEnabled){
    setNotifEnabled(false);
    try { localStorage.removeItem('futsuNotif'); } catch(_e){}
    updNotifBtn();
    return;
  }
  const p = await Notification.requestPermission();
  setNotifEnabled(p === 'granted');
  if(notifEnabled){
    try { localStorage.setItem('futsuNotif', '1'); } catch(_e){}
  }
  updNotifBtn();
}

export function sendNotif(title, body){
  if(notifEnabled && document.hidden) new Notification(title, { body });
}

// PA toggle — Andrés feedback 2026-07-21: default ON, toggle lo apaga si molesta.
export function updPaBtn(){
  const b = document.getElementById('paBtn');
  if(!b) return;
  const on = paEnabledRead();
  b.textContent = on ? 'ON' : 'OFF';
  b.classList.toggle('on', on);
}

export function togglePa(){
  const next = !paEnabledRead();
  setPaEnabled(next);
  updPaBtn();
  trackEvent('pa_toggle', { enabled: next });
}

export function loadPa(){
  updPaBtn();
}

export function togglePanel(id){
  const panels = ['statsPanel', 'tripPanel', 'settingsPanel', 'aboutPanel'];
  const btns = ['statsBtn', 'tripBtn', 'settingsBtn', 'aboutBtn'];
  const i = panels.indexOf(id);
  panels.forEach((p, j) => {
    const isOpen = j === i && !document.getElementById(p).classList.contains('open');
    document.getElementById(p).classList.toggle('open', isOpen);
    document.getElementById(btns[j]).classList.toggle('active', isOpen);
  });
}

export function updVersionInfo(){
  const el = document.getElementById('versionInfo');
  if(el){
    // Formato compacto: vX.Y.Z · abc1234 · YYYY-MM-DD
    el.textContent = `v${VERSION} · ${BUILD} · ${BUILD_DATE}`;
  }
  // Exponer global para inspección desde consola (`window.futsudoroVersion`).
  if(typeof window !== 'undefined'){
    window.futsudoroVersion = { VERSION, BUILD, BUILD_DATE };
  }
}

export function startClock(){
  if(clockTicker) clearTimeout(clockTicker);
  const loop = () => {
    // Pausar cuando la pestaña está oculta para no drenar batería.
    if(document.hidden){
      setClockTicker(null);
      return;
    }
    updAnalogClock();
    const delay = 1000 - (Date.now() % 1000);
    setClockTicker(setTimeout(loop, delay));
  };
  loop();
}

// --- A11y / keyboard helpers para el dropdown de líneas ---

function openLineDropdown(){
  lineDropdown.classList.add('open');
  lineBtn.setAttribute('aria-expanded', 'true');
}
function closeLineDropdown(){
  lineDropdown.classList.remove('open');
  lineBtn.setAttribute('aria-expanded', 'false');
}
function isLineDropdownOpen(){
  return lineDropdown.classList.contains('open');
}

// Event listeners attached at module load
lineBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if(isLineDropdownOpen()) closeLineDropdown();
  else openLineDropdown();
});

lineOptions.forEach((opt, idx) => {
  opt.addEventListener('click', () => selectLine(opt.dataset.line));
  // Soporte teclado: ArrowUp/ArrowDown mueve el foco entre opciones,
  // Enter/Space selecciona, Escape cierra el dropdown.
  opt.setAttribute('role', 'option');
  opt.setAttribute('tabindex', '-1');
  opt.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      selectLine(opt.dataset.line);
      lineBtn.focus();
    } else if(e.key === 'ArrowDown'){
      e.preventDefault();
      const next = lineOptions[idx + 1] || lineOptions[0];
      next.focus();
    } else if(e.key === 'ArrowUp'){
      e.preventDefault();
      const prev = lineOptions[idx - 1] || lineOptions[lineOptions.length - 1];
      prev.focus();
    } else if(e.key === 'Escape'){
      closeLineDropdown();
      lineBtn.focus();
    } else if(e.key === 'Home'){
      e.preventDefault();
      lineOptions[0].focus();
    } else if(e.key === 'End'){
      e.preventDefault();
      lineOptions[lineOptions.length - 1].focus();
    }
  });
});

lineBtn.setAttribute('aria-haspopup', 'listbox');
lineBtn.setAttribute('aria-expanded', 'false');
lineDropdown.setAttribute('role', 'listbox');

document.addEventListener('click', (e) => {
  if(!e.target.closest('.line-selector')) closeLineDropdown();
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && isLineDropdownOpen()) closeLineDropdown();
});

document.getElementById('themeBtn').addEventListener('click', toggleTheme);
document.getElementById('modeBtn').addEventListener('click', toggleMode);
document.getElementById('notifBtn').addEventListener('click', toggleNotif);
document.getElementById('paBtn').addEventListener('click', togglePa);

document.getElementById('statsBtn').addEventListener('click', () => togglePanel('statsPanel'));
document.getElementById('tripBtn').addEventListener('click', () => togglePanel('tripPanel'));
document.getElementById('settingsBtn').addEventListener('click', () => togglePanel('settingsPanel'));
document.getElementById('aboutBtn').addEventListener('click', () => togglePanel('aboutPanel'));

startBtn.addEventListener('click', () => {
  if(timeMode === 'kairos' && overtime){
    if(phase === 'work') addWorkFromPhase();
    advancePhase();
    updDisplay();
    updBtns();
    return;
  }
  if(running){
    pauseTimer();
    return;
  }
  if(!hasStarted){
    setHasStarted(true);
    setPhase('work');
    chimeGo();
  }
  startTimer();
});
resetBtn.addEventListener('click', fullReset);

['inWork', 'inRest', 'inJourneys', 'inLong'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => {
    applyCfg();
    updTripDurationNote();
    if(!running) fullReset();
  });
});

document.getElementById('langSelect').addEventListener('change', (e) => setLocale(e.target.value));

// Checker de rollover de stats (para que funcione si la pestaña queda
// abierta cruzando medianoche).
startRolloverChecker();
