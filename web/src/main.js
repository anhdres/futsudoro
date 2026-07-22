// Entry point. Imports every module and runs the init sequence.
import { LINES } from './data.js';
import { syncRoute } from './util.js';
import { currentLine, timeMode, applyRouteFromPath } from './timer.js';
import {
  detectLocale, applyUIText, buildStations, updDisplay, updBtns,
  updModeBtn, updTripDurationNote, updNotifBtn, startClock, updAnalogClock,
  loadTheme, loadMode, loadNotif, loadPa, setUiLocale, applyUIText as reapplyUIText
} from './ui.js';
import { loadStats } from './stats.js';
import { loadStamps } from './stamps.js';
import { VERSION, BUILD, BUILD_DATE } from './data.js';

// Init sequence
setUiLocale(detectLocale());
loadStats();
loadStamps();
loadTheme();
loadMode();
loadNotif();
loadPa();

// Exponer versión para export y debugging desde la consola.
if(typeof window !== 'undefined'){
  window.futsudoroVersion = `${VERSION} · ${BUILD} · ${BUILD_DATE}`;
}
applyRouteFromPath();

// Reflect URL-derived line state into the line UI.
if(LINES[currentLine]){
  const line = LINES[currentLine];
  document.getElementById('lineNameJp').textContent = line.nameJp;
  document.getElementById('lineNameEn').textContent = line.nameEn;
  document.getElementById('trainIndicator').className = 'train-indicator ' + line.color;
  document.querySelectorAll('.line-option').forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.line === currentLine);
  });
}
updModeBtn();
syncRoute(currentLine, timeMode);

buildStations();
applyUIText();
updDisplay();
updBtns();
updNotifBtn();
updTripDurationNote();
startClock();

// Re-leer la URL cuando el user usa back/forward. Sin esto, la URL cambia
// pero currentLine/timeMode quedan stale y la barra muestra una cosa
// mientras la app muestra otra.
window.addEventListener('popstate', () => {
  applyRouteFromPath();
  syncRoute(currentLine, timeMode);
  if(LINES[currentLine]){
    const line = LINES[currentLine];
    document.getElementById('lineNameJp').textContent = line.nameJp;
    document.getElementById('lineNameEn').textContent = line.nameEn;
    document.getElementById('trainIndicator').className = 'train-indicator ' + line.color;
    document.querySelectorAll('.line-option').forEach(opt => {
      opt.classList.toggle('selected', opt.dataset.line === currentLine);
    });
    buildStations();
  }
  updModeBtn();
  updDisplay();
  updBtns();
});

window.addEventListener('pageshow', updAnalogClock);
document.addEventListener('visibilitychange', () => {
  // Cuando la pestaña vuelve a estar visible, re-arrancar el clock tick.
  // startClock ya chequea document.hidden y se auto-pausa si está oculta.
  if(!document.hidden) startClock();
});

if('serviceWorker' in navigator){
  window.addEventListener('load', async () => {
    try{
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }catch(_e){}
  });
}
