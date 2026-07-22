// Stamps — tracking de estaciones visitadas.
// Base para el futuro "librito de estampillas" (eki stamps japoneses).
// Hoy persiste en localStorage; mañana se renderiza visualmente como un
// passport con sellos coleccionables de las 12 líneas × 6 estaciones = 72 sellos.
//
// Estado: { [lineKey:stationName]: isoTimestamp, ... }

const STORAGE_KEY = '***' + 'uStamps';

let stamps = {};
let listeners = [];

function safeGet(key){
  try { return localStorage.getItem(key); } catch(_e){ return null; }
}
function safeSet(key, val){
  try { localStorage.setItem(key, val); } catch(_e){}
}

export function loadStamps(){
  const s = safeGet(STORAGE_KEY);
  if(s){
    try { stamps = JSON.parse(s) || {}; } catch(_e){ stamps = {}; }
  } else {
    stamps = {};
  }
  notify();
}

function saveStamps(){
  safeSet(STORAGE_KEY, JSON.stringify(stamps));
}

function notify(){
  for(const fn of listeners){
    try{ fn(stamps); }catch(_e){}
  }
}

export function onStampsChange(fn){
  listeners.push(fn);
  return () => { listeners = listeners.filter(f => f !== fn); };
}

// Marca una estación como visitada. Idempotente — si ya estaba visitada,
// conserva el timestamp original (no actualiza).
export function markVisited(lineKey, stationName){
  const key = `${lineKey}:${stationName}`;
  if(stamps[key]) return; // ya visitada
  stamps[key] = new Date().toISOString();
  saveStamps();
  notify();
}

// Devuelve un objeto con todas las estaciones visitadas, agrupadas por línea.
// { yamanote: [{name: 'Shinjuku', visitedAt: '...'}, ...], ... }
export function getStampsByLine(){
  const grouped = {};
  for(const [key, ts] of Object.entries(stamps)){
    const idx = key.indexOf(':');
    const line = key.slice(0, idx);
    const name = key.slice(idx + 1);
    if(!grouped[line]) grouped[line] = [];
    grouped[line].push({ name, visitedAt: ts });
  }
  return grouped;
}

export function getStampsCount(){
  return Object.keys(stamps).length;
}

export function resetStamps(){
  stamps = {};
  saveStamps();
  notify();
}

// Reemplaza todos los stamps (usado por import de backup).
export function setStamps(newStamps){
  if(!newStamps || typeof newStamps !== 'object') return;
  stamps = { ...newStamps };
  saveStamps();
  notify();
}
