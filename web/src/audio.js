// Audio context + chime functions + analytics trackEvent.
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

export function trackEvent(name, data){
  try{
    if(typeof window.va === 'function'){
      window.va('event', { name, data: data || {} });
    }
  }catch(_e){}
}
