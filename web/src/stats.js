// Stats persistence + sparkline render. Owns the `stats` object.
import { currentJourney, cfg } from './timer.js';
import { getStampsByLine } from './stamps.js';

export let stats = {
  today: 0,
  total: 0,
  lastDate: new Date().toDateString(),
  history: [],
  // @serhack + @andrés feedback 2026-07-21 22:48: tiempo separado por tipo
  // (work = tiempo de viaje / rest = tiempo en estaciones). En segundos
  // para que el JSON export tenga precisión sub-minuto.
  travelTimeSec: 0,
  stationTimeSec: 0
};

// Cache para evitar re-render del sparkline cada tick (llamado desde
// updDisplay -> updStatsUI una vez por segundo). Solo se re-renderiza
// cuando cambian los datos o el set de fechas de la ventana.
let sparklineCache = {
  lastHistoryLen: -1,
  lastTotal: -1,
  lastToday: -1,
  lastDateKey: ''
};

// Safe localStorage wrapper (Safari private mode tira QuotaExceededError).
function safeGet(key){
  try { return localStorage.getItem(key); } catch(_e){ return null; }
}
function safeSet(key, val){
  try { localStorage.setItem(key, val); } catch(_e){ /* silent */ }
}

export function loadStats(){
  const s = safeGet('futsuStats');
  if(s){
    try { stats = JSON.parse(s); } catch(_e){ /* keep defaults */ }
    const todayKey = new Date().toDateString();
    if(stats.lastDate !== todayKey){
      rolloverStats(todayKey);
    }
  }
  if(!stats.history) stats.history = [];
  // Invalidate cache so the next renderSparkline call does a full repaint.
  sparklineCache.lastHistoryLen = -1;
  updStatsUI();
}

function rolloverStats(todayKey){
  if(!stats.history) stats.history = [];
  if(stats.today > 0){
    stats.history.push({ date: stats.lastDate, minutes: stats.today });
    if(stats.history.length > 30) stats.history = stats.history.slice(-30);
  }
  stats.today = 0;
  stats.lastDate = todayKey;
}

export function saveStats(){
  safeSet('futsuStats', JSON.stringify(stats));
}

// Re-chequea rollover cada 60s por si la pestaña queda abierta cruzando medianoche.
let rolloverChecker = null;
export function startRolloverChecker(){
  if(rolloverChecker) return;
  rolloverChecker = setInterval(() => {
    const todayKey = new Date().toDateString();
    if(stats.lastDate !== todayKey){
      rolloverStats(todayKey);
      saveStats();
      sparklineCache.lastHistoryLen = -1;
      updStatsUI();
    }
  }, 60000);
}

export function updStatsUI(){
  document.getElementById('stToday').textContent = stats.today;
  document.getElementById('stTotal').textContent = stats.total;
  document.getElementById('curJ').textContent = Math.min(currentJourney + 1, cfg.journeys);
  document.getElementById('totJ').textContent = cfg.journeys;
  renderSparklineIfChanged();
}

function renderSparklineIfChanged(){
  const todayKey = new Date().toDateString();
  const changed =
    stats.history.length !== sparklineCache.lastHistoryLen ||
    stats.total !== sparklineCache.lastTotal ||
    stats.today !== sparklineCache.lastToday ||
    todayKey !== sparklineCache.lastDateKey;
  if(!changed) return;
  sparklineCache = {
    lastHistoryLen: stats.history.length,
    lastTotal: stats.total,
    lastToday: stats.today,
    lastDateKey: todayKey
  };
  renderSparkline();
}

export function renderSparkline(){
  const svg = document.getElementById('statsSparkline');
  if(!svg || !stats.history) return;
  const days = [];
  const today = new Date();
  for(let i = 13; i >= 0; i--){
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toDateString();
    const entry = stats.history.find(h => h.date === key);
    days.push({ date: key, minutes: entry ? entry.minutes : 0, isToday: i === 0 });
  }
  const maxMin = Math.max(...days.map(d => d.minutes), 1);
  const barWidth = 8;
  const gap = 2;
  const padTop = 3;
  const padBottom = 3;
  const innerH = 32 - padTop - padBottom;
  let bars = '';
  days.forEach((d, i) => {
    const h = Math.max((d.minutes / maxMin) * innerH, d.minutes > 0 ? 1 : 0);
    const x = i * (barWidth + gap);
    const y = 32 - padBottom - h;
    const fill = d.isToday
      ? 'var(--green)'
      : (d.minutes > 0 ? 'var(--green)' : 'var(--line)');
    const opacity = d.isToday ? 1 : (d.minutes > 0 ? 0.7 : 1);
    bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="${fill}" opacity="${opacity}" rx="1"/>`;
  });
  svg.innerHTML = bars;
}

export function addWork(m){
  stats.today += m;
  stats.total += m;
  saveStats();
  updStatsUI();
}

// Tiempo de viaje (work block). Andrés feedback 2026-07-21 22:48: separar
// travel time de station time para el backup y futuro librito de estampillas.
// Mantiene today/total en sincronía (sumados desde travelTimeSec para que
// el sparkline y el panel Stats no se rompan).
export function addTravelTime(seconds){
  stats.travelTimeSec = (stats.travelTimeSec || 0) + seconds;
  // Acumular minutos al today/total (en el día actual). Para mantener
  // la UI funcionando como antes: today es minutos del día, total es
  // minutos históricos totales.
  const minutes = Math.round(seconds / 60);
  stats.today += minutes;
  stats.total += minutes;
  saveStats();
  updStatsUI();
}

// Tiempo en estaciones (rest block). today/total NO se actualizan acá
// porque el trabajo (work) es el que cuenta como "productivo".
export function addStationTime(seconds){
  stats.stationTimeSec = (stats.stationTimeSec || 0) + seconds;
  saveStats();
  updStatsUI();
}

// Export stats as CSV or JSON for download.
// @serhack feedback 2026-07-21 22:48 GMT-3: pidió poder descargar las stats.
// Formato:
//   CSV: una fila por día con date,minutes. Hoy se incluye siempre (con
//        0 si no se trabajó todavía).
//   JSON: incluye stats completas + config actual del timer + metadata
//         (versión, fecha de export).
export function exportStats(format){
  const today = new Date().toDateString();
  const dateStamp = new Date().toISOString().slice(0, 10);
  let content, mimeType, filename;
  if(format === 'json'){
    const payload = {
      exportedAt: new Date().toISOString(),
      version: (typeof window !== 'undefined' && window.futsudoroVersion) || 'unknown',
      config: { work: cfg.work, rest: cfg.rest, journeys: cfg.journeys, longRest: cfg.longRest },
      stats: {
        today: stats.today,
        total: stats.total,
        lastDate: stats.lastDate,
        travelTimeSec: stats.travelTimeSec || 0,
        stationTimeSec: stats.stationTimeSec || 0,
        history: [...stats.history]
      },
      // Estaciones visitadas (base para el futuro librito de estampillas).
      stamps: getStampsByLine()
    };
    content = JSON.stringify(payload, null, 2);
    mimeType = 'application/json';
    filename = `futsudoro-stats-${dateStamp}.json`;
  } else {
    // CSV default. Construir set completo de fechas (hoy + 30 días de history).
    const seen = new Set();
    const rows = [];
    for(const h of stats.history){ rows.push([h.date, h.minutes]); seen.add(h.date); }
    rows.push([today, stats.today]);
    seen.add(today);
    // Ordenar cronológicamente.
    rows.sort((a, b) => new Date(a[0]) - new Date(b[0]));
    const lines = ['date,minutes'];
    for(const [d, m] of rows) lines.push(`${d},${m}`);
    content = lines.join('\n');
    mimeType = 'text/csv';
    filename = `futsudoro-stats-${dateStamp}.csv`;
  }
  triggerDownload(content, mimeType, filename);
}

function triggerDownload(content, mimeType, filename){
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Liberar el object URL después de un tick para que el click se procese.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Import: lee el contenido de un archivo de backup (.json) y restaura
// stats + stamps en localStorage. Valida estructura antes de aplicar.
// El config NO se restaura (es local del device), solo stats y stamps.
export function importStats(jsonText){
  let payload;
  try{ payload = JSON.parse(jsonText); }
  catch(e){ throw new Error('JSON inválido: ' + e.message); }
  if(!payload || typeof payload !== 'object'){
    throw new Error('Backup no es un objeto JSON válido');
  }
  if(!payload.stats || typeof payload.stats !== 'object'){
    throw new Error('Backup no tiene sección "stats"');
  }
  // Validar campos mínimos de stats.
  const s = payload.stats;
  if(typeof s.total !== 'number' || typeof s.today !== 'number'){
    throw new Error('Stats incompletas o corruptas');
  }
  // Restaurar stats (preservar claves que el backup viejo no tiene).
  stats = {
    today: s.today || 0,
    total: s.total || 0,
    lastDate: s.lastDate || new Date().toDateString(),
    history: Array.isArray(s.history) ? [...s.history] : [],
    travelTimeSec: s.travelTimeSec || 0,
    stationTimeSec: s.stationTimeSec || 0
  };
  saveStats();
  // Restaurar stamps si están en el backup.
  if(payload.stamps && typeof payload.stamps === 'object'){
    // Convertir formato {line: [{name, visitedAt}]} → {line:name: isoTs}
    const flat = {};
    for(const [line, items] of Object.entries(payload.stamps)){
      if(!Array.isArray(items)) continue;
      for(const item of items){
        if(item && item.name && item.visitedAt){
          flat[`${line}:${item.name}`] = item.visitedAt;
        }
      }
    }
    // Importar via setStamps (lazy import para no cycle).
    import('./stamps.js').then(m => {
      m.setStamps(flat);
      updStatsUI();
    });
  } else {
    updStatsUI();
  }
}
