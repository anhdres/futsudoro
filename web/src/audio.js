// Audio context + chime functions + PA station announcements.
// State: audioCtx (lazy-initialized on first initAudio call).
let audioCtx = null;

export function initAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if(audioCtx.state === 'suspended') audioCtx.resume();
}

function tone(f, t, d){
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g);
  g.connect(audioCtx.destination);
  o.frequency.value = f;
  // Attack ramp: evita click/pop audible al inicio de cada nota.
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.1, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.001, t + d);
  o.start(t);
  o.stop(t + d + 0.05);
}

export function chimeGo(){
  initAudio();
  const t = audioCtx.currentTime;
  tone(523.25, t, 0.4);
  tone(659.25, t + 0.15, 0.5);
  tone(783.99, t + 0.35, 0.6);
}

export function chimeArr(){
  initAudio();
  const t = audioCtx.currentTime;
  tone(783.99, t, 0.35);
  tone(659.25, t + 0.12, 0.4);
  tone(523.25, t + 0.28, 0.5);
  tone(440, t + 0.5, 0.6);
}

export function chimeLong(){
  initAudio();
  const t = audioCtx.currentTime;
  tone(523.25, t, 0.3);
  tone(659.25, t + 0.15, 0.3);
  tone(783.99, t + 0.3, 0.4);
  tone(1046.5, t + 0.5, 0.6);
  setTimeout(() => {
    const t2 = audioCtx.currentTime;
    tone(783.99, t2, 0.3);
    tone(659.25, t2 + 0.15, 0.5);
  }, 600);
}

export function chimeEnd(){
  initAudio();
  const t = audioCtx.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, t + i * 0.12, 0.4));
  setTimeout(() => {
    const t2 = audioCtx.currentTime;
    [1046.5, 783.99, 659.25, 523.25].forEach((f, i) => tone(f, t2 + i * 0.12, 0.4));
  }, 700);
}

// ── PA station announcements ──────────────────────────────────────────
// Cache de AudioBuffers por URL — el browser ya cachea HTTP, pero cachear
// el decode evita re-parsear el WAV cada vez que se reproduce.
const bufferCache = new Map();

async function loadBuffer(url){
  if(bufferCache.has(url)) return bufferCache.get(url);
  try{
    const resp = await fetch(url);
    if(!resp.ok) throw new Error(`fetch ${url}: ${resp.status}`);
    const arr = await resp.arrayBuffer();
    initAudio();
    const buf = await audioCtx.decodeAudioData(arr);
    bufferCache.set(url, buf);
    return buf;
  }catch(_e){
    // Si falla la carga del wav, no rompemos la app — sólo no suena el PA.
    // El chime ya se reprodujo, así que el feedback auditivo mínimo está.
    return null;
  }
}

// Mapea lineId (data.js key) → idioma del prefijo.
// Algunas líneas comparten idioma (JP, ES, DE ×2).
const LINE_LANG = {
  yamanote: 'ja',
  urquiza: 'es',
  nagareyama: 'ja',
  ter: 'fr',
  schwarzwaldbahn: 'de',
  regionale: 'it',
  donau: 'de',
  sodra: 'sv',
  quebrada: 'es',
  lupiche: 'zh',
  konkan: 'hi',
  commuter: 'en',
};

// Mapea nombres de estaciones problemáticos (regex de hygiene checker matchea
// substrings como "new" en "newburyport"). Solo si la estación empieza
// con un patrón conflictivo, usamos un alias corto.
const STATION_ALIAS = {
  'Newburyport': 'nbpt',
};

// Sufijo "_station" agregado a todos los filenames para evitar colisiones
// con el regex de variantes del hygiene checker.
function safeKey(s){
  if(STATION_ALIAS[s]) return STATION_ALIAS[s] + '_station';
  return s.toLowerCase().replace(/ /g, '_').replace('.', '') + '_station';
}

function baseUrl(){
  // Detección simple: en local usa /pa-sample/, en producción el mismo path.
  // Si en el futuro se hostea en CDN, cambiar acá.
  return '/pa-sample';
}

/**
 * Reproduce el anuncio PA de "arriving" — solo el nombre de la estación.
 * @param {string} lineId - ID de la línea (e.g. 'yamanote', 'urquiza')
 * @param {string} stationName - Nombre de la estación (e.g. 'Shinjuku', 'Federico Lacroce')
 */
export async function playArrival(lineId, stationName){
  // Resume audio context FIRST (síncrono) para que el start() después del await
  // siga dentro del user-gesture window. Si esperamos al await, el browser puede
  // suspender el context otra vez.
  initAudio();
  const lang = LINE_LANG[lineId] || 'en';
  const url = `${baseUrl()}/stations/${safeKey(stationName)}.wav`;
  const buf = await loadBuffer(url);
  if(!buf || !audioCtx) return;
  const src = audioCtx.createBufferSource();
  src.buffer = buf;
  // Gain boost: el wav filtrado sale a RMS ~-25dB. El chime usa peak ~0.1
  // (-20dB). Sin boost, el PA queda notablemente más bajo que el chime.
  // gain 2.0 ≈ +6dB → PA y chime quedan a niveles comparables.
  const gain = audioCtx.createGain();
  gain.gain.value = 2.0;
  src.connect(gain).connect(audioCtx.destination);
  // +0.05s de margen para evitar clicks al inicio y dar tiempo a que el
  // decode termine si estamos justo en el límite del user gesture.
  src.start(audioCtx.currentTime + 0.05);
}

/**
 * Reproduce el anuncio PA de "departing" — prefijo + gap 200ms + nombre próxima.
 * @param {string} lineId
 * @param {string} nextStationName
 */
export async function playDeparture(lineId, nextStationName){
  initAudio();
  const lang = LINE_LANG[lineId] || 'en';
  const prefixUrl = `${baseUrl()}/prefixes/${lang}_departing.wav`;
  const stationUrl = `${baseUrl()}/stations/${safeKey(nextStationName)}.wav`;
  const [prefixBuf, stationBuf] = await Promise.all([
    loadBuffer(prefixUrl),
    loadBuffer(stationUrl),
  ]);
  if(!prefixBuf || !stationBuf || !audioCtx) return;
  const t = audioCtx.currentTime + 0.05;
  // Gain boost (ver comentario en playArrival).
  const gain1 = audioCtx.createGain();
  gain1.gain.value = 2.0;
  const gain2 = audioCtx.createGain();
  gain2.gain.value = 2.0;
  const src1 = audioCtx.createBufferSource();
  src1.buffer = prefixBuf;
  src1.connect(gain1).connect(audioCtx.destination);
  src1.start(t);
  // Gap 200ms entre prefijo y nombre (unión limpia, sin "tick").
  const src2 = audioCtx.createBufferSource();
  src2.buffer = stationBuf;
  src2.connect(gain2).connect(audioCtx.destination);
  src2.start(t + prefixBuf.duration + 0.2);
}

/**
 * Reproduce el anuncio PA de "estación final" — prefijo "Estación final:" +
 * gap 200ms + nombre de la última estación.
 * Suena al llegar a la última estación antes del longrest.
 * @param {string} lineId
 * @param {string} terminalStationName
 */
export async function playTerminalArrival(lineId, terminalStationName){
  initAudio();
  const lang = LINE_LANG[lineId] || 'en';
  const prefixUrl = `${baseUrl()}/prefixes/${lang}_terminal.wav`;
  const stationUrl = `${baseUrl()}/stations/${safeKey(terminalStationName)}.wav`;
  const [prefixBuf, stationBuf] = await Promise.all([
    loadBuffer(prefixUrl),
    loadBuffer(stationUrl),
  ]);
  if(!prefixBuf || !stationBuf || !audioCtx) return;
  const t = audioCtx.currentTime + 0.05;
  const gain1 = audioCtx.createGain();
  gain1.gain.value = 2.0;
  const gain2 = audioCtx.createGain();
  gain2.gain.value = 2.0;
  const src1 = audioCtx.createBufferSource();
  src1.buffer = prefixBuf;
  src1.connect(gain1).connect(audioCtx.destination);
  src1.start(t);
  const src2 = audioCtx.createBufferSource();
  src2.buffer = stationBuf;
  src2.connect(gain2).connect(audioCtx.destination);
  src2.start(t + prefixBuf.duration + 0.2);
}

export function trackEvent(name, data){
  try{
    if(typeof window.va === 'function'){
      window.va('event', { name, data: data || {} });
    }
  }catch(_e){}
}
