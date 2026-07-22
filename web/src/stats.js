// Stats persistence + sparkline render. Owns the `stats` object.
import { currentJourney, cfg } from './timer.js';

export let stats = {
  today: 0,
  total: 0,
  lastDate: new Date().toDateString(),
  history: []
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
        history: [...stats.history]
      }
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
