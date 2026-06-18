// Entry point. Imports every module and runs the init sequence that the
// original app.js performed at the bottom of the file.
import { LINES } from './data.js';
import { syncRoute } from './util.js';
import { currentLine, timeMode, applyRouteFromPath } from './timer.js';
import {
  detectLocale, applyUIText, buildStations, updDisplay, updBtns,
  updModeBtn, updTripDurationNote, updNotifBtn, startClock, updAnalogClock,
  loadTheme, loadMode, loadNotif, setUiLocale
} from './ui.js';
import { loadStats } from './stats.js';

// Init sequence (mirrors the bottom of the original app.js).
setUiLocale(detectLocale());
loadStats();
loadTheme();
loadMode();
loadNotif();
applyRouteFromPath();

// Reflect URL-derived line state into the line UI.
if(LINES[currentLine]){
  // Reuse the same DOM update path selectLine uses, but skip the route sync
  // and fullReset which would clobber the URL we just parsed.
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

window.addEventListener('pageshow', updAnalogClock);
document.addEventListener('visibilitychange', () => {
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
