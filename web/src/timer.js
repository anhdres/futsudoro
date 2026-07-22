// Core timer state + control flow. Owns: currentLine, cfg, timeLeft, running,
// ticker, clockTicker, currentJourney, phase, hasStarted, timeMode, overtime,
// overtimeSeconds. State is exported as live `let` bindings; mutations from
// other modules go through the setter helpers below (re-exporting a `let`
// makes it read-only to importers).
import { LINES } from './data.js';
import { normalizeLineKey, getStationsFor } from './util.js';
import { chimeGo, chimeArr, chimeLong, chimeEnd, playArrival, playDeparture, playTerminalArrival } from './audio.js';
import { addWork, addTravelTime, addStationTime } from './stats.js';
import { markVisited } from './stamps.js';
import { updDisplay, updBtns, buildStations, sendNotif } from './ui.js';

// State (mutable within this module, read-only to importers)
export let currentLine = 'yamanote';
export let cfg = { work: 25, rest: 5, journeys: 4, longRest: 35 };
export let timeLeft = cfg.work * 60;
export let running = false;
export let ticker = null;
export let clockTicker = null;
export let currentJourney = 0;
export let phase = 'work';
export let hasStarted = false;
export let timeMode = 'chronos';
export let overtime = false;
export let overtimeSeconds = 0;

// Longrest completion timeout id (used to cancel pending fullReset on user reset)
let longrestResetTimer = null;

// Wake Lock — evita que el OS suspenda el thread de JS mientras el timer corre.
// Crítico en mobile: si el browser entra en background, sin wake lock el
// setInterval se throttlea/pausa y el timer puede quedar desfasado.
// Andrés feedback 2026-07-21: timer quedaba en 00:01 al desbloquear el teléfono.
let wakeLock = null;
async function requestWakeLock(){
  if(!('wakeLock' in navigator)) return;
  try{
    wakeLock = await navigator.wakeLock.request('screen');
    // Si el wake lock se libera (ej. tab en background), re-pedir al volver.
    wakeLock.addEventListener('release', () => {
      wakeLock = null;
      if(running && !document.hidden) requestWakeLock();
    });
  }catch(_e){
    // Permiso denegado o feature no disponible. Degradamos gracefully.
    wakeLock = null;
  }
}
function releaseWakeLock(){
  if(wakeLock){
    try{ wakeLock.release(); }catch(_e){}
    wakeLock = null;
  }
}

// Re-sync de timer cuando el tab vuelve a visible. Corrige el drift acumulado
// durante el background (donde setInterval se throttlea/pausa).
// Andrés feedback 2026-07-21: al desbloquear el teléfono, el timer quedaba
// en 00:01 sin avanzar. Causa: el último tick comprimido lleva timeLeft a 0,
// dispara advancePhase(), pero el siguiente tick (también comprimido) corre
// con timeLeft ya en 300 (rest) y lo decrementa mucho de golpe.
let lastTickTime = Date.now();

// Timestamp absoluto del inicio de la fase actual. Se usa para calcular
// timeLeft en vez de decrementar por tick — así el valor refleja el tiempo
// real aunque el setInterval se throttlee en background (Chrome Windows:
// 1 tick/minuto en tabs minimizadas, Safari iOS: pausa completa).
// Andrés feedback 2026-07-21: 'directamente deja de contar el tiempo cuando
// la app es minimizada o pasa al background' en Windows.
let phaseStartedAt = Date.now();
// Idem para overtime (modo Kairos): el overtimeSeconds se calcula desde
// overtimeStartedAt, no se acumula por tick. Si el browser pausea los
// timers durante horas, al volver el overtime refleja el tiempo real.
let overtimeStartedAt = Date.now();
function phaseDurationSec(){
  if(phase === 'work') return cfg.work * 60;
  if(phase === 'rest') return cfg.rest * 60;
  return cfg.longRest * 60;
}
function recomputeTimeLeft(){
  if(phase === 'work' && timeMode === 'kairos' && overtime) return; // overtime usa overtimeSeconds
  const elapsedSec = Math.floor((Date.now() - phaseStartedAt) / 1000);
  timeLeft = Math.max(0, phaseDurationSec() - elapsedSec);
}
function recomputeOvertime(){
  const elapsedSec = Math.floor((Date.now() - overtimeStartedAt) / 1000);
  overtimeSeconds = Math.max(0, elapsedSec);
}
function resyncTimer(){
  if(!running) return;
  const now = Date.now();
  const elapsedMs = now - lastTickTime;
  // Si pasaron más de 5s sin tick, recomputar timeLeft desde timestamp
  // absoluto y disparar transición si corresponde.
  if(elapsedMs > 5000){
    if(timeMode === 'kairos' && overtime){
      // Recalcular overtimeSeconds desde timestamp absoluto.
      recomputeOvertime();
    } else {
      // Recalcular desde phaseStartedAt (ignora timeLeft acumulado).
      recomputeTimeLeft();
      if(timeLeft <= 0){
        timeLeft = 0;
        clearInterval(ticker);
        running = false;
        if(phase === 'work') addWork(cfg.work);
        const shouldContinue = advancePhase();
        if(shouldContinue) startTimer();
      }
    }
    lastTickTime = now;
    updDisplay();
    updBtns();
  }
}

// Setters for cross-module mutation
export function setCurrentLine(next){ currentLine = normalizeLineKey(next); }
export function setTimeMode(next){
  if(next === 'kairos' || next === 'chronos') timeMode = next;
}
export function setTimeLeft(next){ timeLeft = next; }
export function setCurrentJourney(next){ currentJourney = next; }
export function setPhase(next){ phase = next; }
export function setHasStarted(next){ hasStarted = next; }
export function setRunning(next){ running = next; }
export function setTicker(next){ ticker = next; }
export function setClockTicker(next){ clockTicker = next; }
export function setOvertime(next){ overtime = next; }
export function setOvertimeSeconds(next){ overtimeSeconds = next; }
export function setCfg(next){ cfg = next; }

// PA setting — leído desde localStorage. Default ON.
// Andrés feedback (2026-07-21): default ON, el toggle lo apaga si molesta.
export function paEnabled(){
  try{
    const v = localStorage.getItem('futsudoro.paEnabled');
    if(v === null) return true;
    return v === '1' || v === 'true';
  }catch(_e){
    return true;
  }
}
export function setPaEnabled(next){
  try{ localStorage.setItem('futsudoro.paEnabled', next ? '1' : '0'); }catch(_e){}
}

export function phaseTargetSeconds(){
  if(phase === 'work') return cfg.work * 60;
  if(phase === 'rest') return cfg.rest * 60;
  return cfg.longRest * 60;
}

// Used by kairos overtime "Next" press to credit accumulated time.
export function addWorkFromPhase(){
  const totalSecs = (cfg.work * 60) + (overtime ? overtimeSeconds : 0);
  addWork(Math.round(totalSecs / 60));
}

export function enterOvertime(){
  overtime = true;
  overtimeSeconds = 0;
  overtimeStartedAt = Date.now();
  if(phase === 'work'){
    chimeArr();
    sendNotif('Futsu-doro', 'Preset complete. Continue or move to next stop.');
  } else if(phase === 'longrest'){
    // Kairos + longrest reached 0: el user puede seguir descansando o terminar.
    // Usamos chimeEnd (no chimeGo) porque longrest es la estación final,
    // no una parada intermedia de la que se "parte".
    chimeLong();
    sendNotif('Futsu-doro', 'Long rest complete. Press ready when you want to finish.');
  } else {
    chimeGo();
    sendNotif('Futsu-doro', 'Break preset complete. Press ready when you want to continue.');
  }
}

export function advancePhase(){
  if(phase === 'work'){
    currentJourney++;
    overtime = false;
    overtimeSeconds = 0;
    overtimeStartedAt = Date.now();
    if(currentJourney >= cfg.journeys){
      phase = 'longrest';
      timeLeft = cfg.longRest * 60;
      phaseStartedAt = Date.now();
      chimeLong();
      // PA: estación final (última del viaje). El prefijo "Estación final:"
      // precede al nombre, igual que los otros anuncios (prefijo + nombre).
      // currentJourney ya se incrementó arriba, así que apunta a la última.
      if(paEnabled()){
        const stationEntry = getStationsFor(currentLine)[currentJourney];
        setTimeout(() => playTerminalArrival(currentLine, stationEntry), 1500);
      }
      sendNotif('Futsu-doro', '終点。Final Destination ' + cfg.longRest + ' min.');
    } else {
      phase = 'rest';
      timeLeft = cfg.rest * 60;
      phaseStartedAt = Date.now();
      chimeArr();
      // PA: announce arrival at the new station.
      // Delay 1.5s para que el chime termine antes (no overlap).
      // Bug fix 2026-07-21: stationName es la NUEVA estación a la que llegamos
      // (currentJourney ya se incrementó arriba).
      // Marcar la estación como visitada (librito de estampillas, futuro).
      // Se llama SIEMPRE, independientemente del toggle PA — la visita al
      // andén es independiente del anuncio audible.
      const stationEntry = getStationsFor(currentLine)[currentJourney];
      const visitedStation = stationEntry.en || stationEntry.jp;
      if(visitedStation) markVisited(currentLine, visitedStation);
      if(paEnabled()){
        setTimeout(() => playArrival(currentLine, stationEntry), 1500);
      }
      sendNotif('Futsu-doro', 'At station ' + getStationsFor(currentLine)[currentJourney].jp + '. ' + cfg.rest + ' min rest.');
    }
    return true;
  }
  if(phase === 'rest'){
    overtime = false;
    overtimeSeconds = 0;
    overtimeStartedAt = Date.now();
    phase = 'work';
    timeLeft = cfg.work * 60;
    phaseStartedAt = Date.now();
    chimeGo();
    // PA: announce departure toward NEXT station.
    // Bug fix 2026-07-21: al partir de la estación actual, el PA debe decir
    // la PRÓXIMA, no la actual. currentJourney apunta a la estación donde
    // estamos, así que la próxima es currentJourney + 1 (con wrap-around).
    if(paEnabled()){
      const stations = getStationsFor(currentLine);
      const nextIdx = (currentJourney + 1) % stations.length;
      setTimeout(() => playDeparture(currentLine, stations[nextIdx]), 1500);
    }
    sendNotif('Futsu-doro', 'Departing. ' + cfg.work + ' min of work.');
    return true;
  }
  if(phase === 'longrest'){
    chimeEnd();
    sendNotif('Futsu-doro', 'Session complete. Resetting.');
    // Guardamos el id para poder cancelar si el user hace reset antes.
    longrestResetTimer = setTimeout(() => {
      longrestResetTimer = null;
      fullReset();
    }, 800);
    return false;
  }
  return false;
}

export function tick(){
  lastTickTime = Date.now();
  if(timeMode === 'kairos' && overtime){
    // Calcular overtimeSeconds desde timestamp absoluto (no acumular ticks).
    recomputeOvertime();
    updDisplay();
    updBtns();
    return;
  }
  // Calcular timeLeft desde timestamp absoluto (no acumular ticks).
  // Independiza del throttle del browser en background.
  recomputeTimeLeft();
  if(timeLeft <= 0){
    timeLeft = 0;
    if(timeMode === 'kairos'){
      enterOvertime();
      updDisplay();
      updBtns();
      return;
    }
    clearInterval(ticker);
    running = false;
    if(phase === 'work') addTravelTime(cfg.work * 60);
    else if(phase === 'rest') addStationTime(cfg.rest * 60);
    const shouldContinue = advancePhase();
    if(shouldContinue) startTimer();
    updDisplay();
    updBtns();
    return;
  }
  updDisplay();
}

export function startTimer(){
  if(running) return;
  running = true;
  ticker = setInterval(tick, 1000);
  lastTickTime = Date.now();
  // Reset del timestamp de fase para que recomputeTimeLeft calcule desde ahora.
  // Importante cuando se llama después de un long background sin ticks.
  phaseStartedAt = Date.now();
  overtimeStartedAt = Date.now();
  // Wake Lock: pedir al OS que mantenga el thread activo (mobile).
  if(!document.hidden) requestWakeLock();
  updDisplay();
  updBtns();
}

export function pauseTimer(){
  if(!running) return;
  running = false;
  clearInterval(ticker);
  releaseWakeLock();
  updDisplay();
  updBtns();
}

export function fullReset(){
  // Cancelar cualquier reset diferido de longrest para evitar doble reset.
  if(longrestResetTimer !== null){
    clearTimeout(longrestResetTimer);
    longrestResetTimer = null;
  }
  pauseTimer();
  phase = 'work';
  hasStarted = false;
  currentJourney = 0;
  timeLeft = cfg.work * 60;
  phaseStartedAt = Date.now();
  overtime = false;
  overtimeSeconds = 0;
  overtimeStartedAt = Date.now();
  lastTickTime = Date.now();
  buildStations();
  // Reset clock hands via updAnalogClock (acoplamiento DOM queda en ui.js).
  const tpEl = document.getElementById('trackProgress');
  if(tpEl) tpEl.style.width = '0%';
  // Trigger one analog clock tick (will render 0deg hands).
  updDisplay();
  updBtns();
  // Forzar reset de las agujas después de updDisplay, ya que updDisplay
  // no toca el reloj analógico (lo maneja startClock).
  const sh = document.getElementById('secondHand');
  const mh = document.getElementById('minuteHand');
  const hh = document.getElementById('hourHand');
  if(sh) sh.style.transform = 'rotate(0deg)';
  if(mh) mh.style.transform = 'rotate(0deg)';
  if(hh) hh.style.transform = 'rotate(0deg)';
}

export function applyCfg(){
  cfg.work = +document.getElementById('inWork').value || 25;
  cfg.rest = +document.getElementById('inRest').value || 5;
  cfg.journeys = Math.min(5, Math.max(2, +document.getElementById('inJourneys').value || 4));
  document.getElementById('inJourneys').value = cfg.journeys;
  cfg.longRest = +document.getElementById('inLong').value || 35;
}

// Read the current URL and update currentLine/timeMode if valid segments are
// present. Lives in timer.js because it mutates timer-owned state.
export function applyRouteFromPath(){
  const validModes = ['chronos', 'kairos'];
  const segments = window.location.pathname
    .split('/')
    .filter(Boolean)
    .map(s => decodeURIComponent(s).toLowerCase());

  let routeLine = null;
  let routeMode = null;

  segments.forEach(seg => {
    if(validModes.includes(seg)){
      routeMode = seg;
      return;
    }
    if(LINES[seg]){
      routeLine = seg;
    }
    // Nota: el fallback para slugs no-ASCII vive en normalizeLineKey;
    // si el segmento no matchea ninguna línea conocida, se ignora (mantiene default).
  });

  if(routeLine) setCurrentLine(routeLine);
  if(routeMode) setTimeMode(routeMode);
}

// Re-sync timer + wake lock al cambiar visibilidad.
// Andrés feedback 2026-07-21: timer quedaba trabado en 00:01 al desbloquear
// el teléfono en mobile. Causa: setInterval se throttlea/pausa en background,
// el último tick comprimido lleva timeLeft a 0 pero los siguientes corren
// contra un timeLeft ya reseteado por advancePhase, generando drift.
document.addEventListener('visibilitychange', () => {
  if(document.hidden){
    // Tab entró en background — wake lock se libera automáticamente,
    // pero podemos soltar el nuestro también para ahorrar batería.
    releaseWakeLock();
    return;
  }
  // Tab volvió a visible — primero re-sincronizar el timer (puede
  // haber drift acumulado), luego re-pedir wake lock.
  resyncTimer();
  if(running) requestWakeLock();
});
