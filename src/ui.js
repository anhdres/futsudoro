// All DOM references, render functions, event listeners.
// Owns: uiLocale, notifEnabled, isDark. Reads timer state via live bindings.
import { LINES, UI_STRINGS } from './data.js';
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
import { updStatsUI } from './stats.js';
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

// Setters for UI state
export function setUiLocale(next){
  uiLocale = next;
}

export function setNotifEnabled(next){
  notifEnabled = next;
}

export function setIsDark(next){
  isDark = next;
}

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
  document.getElementById('langSelect').value = uiLocale;
  refreshThemeButton();
  updNotifBtn();
  updTripDurationNote();
  updBtns();
}

export function setLocale(next){
  if(!UI_STRINGS[next]) return;
  setUiLocale(next);
  localStorage.setItem('futsuUiLocale', next);
  applyUIText();
}

export function selectLine(lineKey){
  setCurrentLine(lineKey);
  const line = LINES[currentLine];
  trackEvent('Line Changed', { line: currentLine });
  syncRoute(currentLine, timeMode);
  lineNameJp.textContent = line.nameJp;
  lineNameEn.textContent = line.nameEn;
  // Update train color
  trainInd.className = 'train-indicator ' + line.color;
  // Update dropdown selection
  document.querySelectorAll('.line-option').forEach(opt => {
    opt.classList.toggle('selected', normalizeLineKey(opt.dataset.line) === currentLine);
  });
  lineDropdown.classList.remove('open');
  // Reset with new stations
  fullReset();
}

export function buildStations(){
  trackEl.querySelectorAll('.station').forEach(e => e.remove());
  const n = cfg.journeys + 1;
  const stations = LINES[currentLine].stations;
  stations.slice(0, n).forEach((st, i) => {
    const d = document.createElement('div');
    d.className = 'station';
    d.innerHTML = '<div class="station-dot"></div><div class="station-name"><span class="station-name-jp">' + st.jp + '</span>' + (st.en ? '<span class="station-name-en">' + st.en + '</span>' : '') + '</div>';
    trackEl.appendChild(d);
  });
}

export function updStations(){
  const stations = trackEl.querySelectorAll('.station');
  stations.forEach((el, i) => {
    el.classList.remove('active', 'done');

    if(!hasStarted){
      if(i === currentJourney) el.classList.add('active');
      return;
    }

    if(i < currentJourney || (phase === 'work' && i === currentJourney)){
      // Estaciones completadas: las que están atrás + la actual si estamos en viaje
      el.classList.add('done');
    } else if(i === currentJourney && phase !== 'work'){
      // Estación actual solo cuando estamos parados (rest/longrest)
      el.classList.add('active');
    }
    // Si i > currentJourney: estación futura (sin color)
  });
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
    tpEl.style.width = (totalProgCalc(cfg, timeLeft, currentJourney) * 100) + '%';
  } else if(phase === 'longrest'){
    tpEl.style.width = '100%';
  } else if(!hasStarted){
    tpEl.style.width = '0%';
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
  if(localStorage.getItem('futsuTheme') === 'dark'){
    setIsDark(true);
    document.body.classList.add('dark');
  }
  refreshThemeButton();
}

export function toggleTheme(){
  setIsDark(!isDark);
  document.body.classList.toggle('dark', isDark);
  refreshThemeButton();
  localStorage.setItem('futsuTheme', isDark ? 'dark' : 'light');
}

export function updModeBtn(){
  const b = document.getElementById('modeBtn');
  b.textContent = timeMode === 'kairos' ? 'Kairos' : 'Chronos';
  b.classList.toggle('on', timeMode === 'kairos');
}

export function loadMode(){
  const saved = localStorage.getItem('futsuTimeMode');
  if(saved === 'kairos' || saved === 'chronos') setTimeMode(saved);
  updModeBtn();
}

export function toggleMode(){
  setTimeMode(timeMode === 'chronos' ? 'kairos' : 'chronos');
  localStorage.setItem('futsuTimeMode', timeMode);
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
  if('Notification' in window && localStorage.getItem('futsuNotif') && Notification.permission === 'granted'){
    setNotifEnabled(true);
  }
}

export async function toggleNotif(){
  if(!('Notification' in window)) return;
  if(notifEnabled){
    setNotifEnabled(false);
    localStorage.removeItem('futsuNotif');
    updNotifBtn();
    return;
  }
  const p = await Notification.requestPermission();
  setNotifEnabled(p === 'granted');
  if(notifEnabled) localStorage.setItem('futsuNotif', '1');
  updNotifBtn();
}

export function sendNotif(title, body){
  if(notifEnabled && document.hidden) new Notification(title, { body });
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

export function startClock(){
  if(clockTicker) clearTimeout(clockTicker);
  const loop = () => {
    updAnalogClock();
    const delay = 1000 - (Date.now() % 1000);
    setClockTicker(setTimeout(loop, delay));
  };
  loop();
}

// Event listeners attached at module load
lineBtn.onclick = () => lineDropdown.classList.toggle('open');
document.querySelectorAll('.line-option').forEach(opt => {
  opt.onclick = () => selectLine(opt.dataset.line);
});
document.addEventListener('click', (e) => {
  if(!e.target.closest('.line-selector')) lineDropdown.classList.remove('open');
});

document.getElementById('themeBtn').onclick = toggleTheme;
document.getElementById('modeBtn').onclick = toggleMode;
document.getElementById('notifBtn').onclick = toggleNotif;

document.getElementById('statsBtn').onclick = () => togglePanel('statsPanel');
document.getElementById('tripBtn').onclick = () => togglePanel('tripPanel');
document.getElementById('settingsBtn').onclick = () => togglePanel('settingsPanel');
document.getElementById('aboutBtn').onclick = () => togglePanel('aboutPanel');

startBtn.onclick = () => {
  if(timeMode === 'kairos' && overtime){
    if(phase === 'work') addWorkFromPhase();
    advancePhase();
    updDisplay();
    updBtns();
    return;
  }
  if(running){
    setTimeout(pauseTimer, 70);
    return;
  }
  if(!hasStarted){
    setHasStarted(true);
    setPhase('work');
    chimeGo();
  }
  startTimer();
};
resetBtn.onclick = fullReset;

['inWork', 'inRest', 'inJourneys', 'inLong'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => {
    applyCfg();
    updTripDurationNote();
    if(!running) fullReset();
  });
});

document.getElementById('langSelect').addEventListener('change', (e) => setLocale(e.target.value));
