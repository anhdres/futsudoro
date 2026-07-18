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
