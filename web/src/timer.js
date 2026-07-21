// Core timer state + control flow. Owns: currentLine, cfg, timeLeft, running,
// ticker, clockTicker, currentJourney, phase, hasStarted, timeMode, overtime,
// overtimeSeconds. State is exported as live `let` bindings; mutations from
// other modules go through the setter helpers below (re-exporting a `let`
// makes it read-only to importers).
import { LINES } from './data.js';
import { normalizeLineKey, getStationsFor } from './util.js';
import { chimeGo, chimeArr, chimeLong, chimeEnd, playArrival, playDeparture } from './audio.js';
import { addWork } from './stats.js';
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
    if(currentJourney >= cfg.journeys){
      phase = 'longrest';
      timeLeft = cfg.longRest * 60;
      chimeLong();
      sendNotif('Futsu-doro', '終点。Final Destination ' + cfg.longRest + ' min.');
    } else {
      phase = 'rest';
      timeLeft = cfg.rest * 60;
      chimeArr();
      // PA: announce arrival at the new station.
      // El chime ya se reprodujo; el PA sale 200ms después (audio.js maneja gap).
      if(paEnabled()){
        const stationName = getStationsFor(currentLine)[currentJourney].jp;
        playArrival(currentLine, stationName);
      }
      sendNotif('Futsu-doro', 'At station ' + getStationsFor(currentLine)[currentJourney].jp + '. ' + cfg.rest + ' min rest.');
    }
    return true;
  }
  if(phase === 'rest'){
    overtime = false;
    overtimeSeconds = 0;
    phase = 'work';
    timeLeft = cfg.work * 60;
    chimeGo();
    // PA: announce departure toward next station.
    if(paEnabled()){
      const stations = getStationsFor(currentLine);
      const nextStation = stations[currentJourney] ? stations[currentJourney].jp : null;
      if(nextStation) playDeparture(currentLine, nextStation);
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
  if(timeMode === 'kairos' && overtime){
    overtimeSeconds++;
    updDisplay();
    updBtns();
    return;
  }
  timeLeft--;
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
    if(phase === 'work') addWork(cfg.work);
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
  updDisplay();
  updBtns();
}

export function pauseTimer(){
  if(!running) return;
  running = false;
  clearInterval(ticker);
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
  overtime = false;
  overtimeSeconds = 0;
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
