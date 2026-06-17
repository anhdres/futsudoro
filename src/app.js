// Line configurations with JP + Latin station names
const LINES={
  yamanote:{
    nameJp:'山手線',
    nameEn:'Yamanote',
    color:'green',
    status:{
      topStopped:'停車中',
      topTransit:'運行中',
      stopped:'{station}駅に停車中',
      transit:'運行中・次は{station}'
    },
    stations:[
      {jp:'新宿',en:'Shinjuku'},
      {jp:'渋谷',en:'Shibuya'},
      {jp:'原宿',en:'Harajuku'},
      {jp:'東京',en:'Tokyo'},
      {jp:'秋葉原',en:'Akihabara'},
      {jp:'上野',en:'Ueno'}
    ]
  },
  urquiza:{
    nameJp:'Urquiza',
    nameEn:'Buenos Aires',
    color:'yellow',
    status:{
      topStopped:'Detenido',
      topTransit:'En tránsito',
      stopped:'Detenido en {station}',
      transit:'En tránsito - Próxima estación: {station}'
    },
    stations:[
      {jp:'Federico Lacroze',en:''},
      {jp:'Arata',en:''},
      {jp:'Antonio Devoto',en:''},
      {jp:'Coronel F. Lynch',en:''},
      {jp:'Tropezón',en:''},
      {jp:'Martín Coronado',en:''}
    ]
  },
  nagareyama:{
    nameJp:'流山電鉄',
    nameEn:'Nagareyama',
    color:'red',
    status:{
      topStopped:'停車中',
      topTransit:'運行中',
      stopped:'{station}駅に停車中',
      transit:'運行中・次は{station}'
    },
    stations:[
      {jp:'馬橋',en:'Mabashi'},
      {jp:'幸谷',en:'Kōya'},
      {jp:'小金城趾',en:'Koen'},
      {jp:'平和台',en:'Heiwadai'},
      {jp:'流山',en:'Nagareyama'},
      {jp:'流山セントラルパーク',en:'Nagareyama-Central Park'}
    ]
  },
  ter:{
    nameJp:'Centre',
    nameEn:'France',
    color:'ter-blue',
    status:{
      topStopped:"À l'arrêt",
      topTransit:'En circulation',
      stopped:"À l'arrêt à {station}",
      transit:'En circulation - Prochaine gare : {station}'
    },
    stations:[
      {jp:'Paris Austerlitz',en:''},
      {jp:'Juvisy',en:''},
      {jp:'Étampes',en:''},
      {jp:'Les Aubrais',en:''},
      {jp:'Mer',en:''},
      {jp:'Blois Chambord',en:''}
    ]
  },
  schwarzwaldbahn:{
    nameJp:'Schwarzwald',
    nameEn:'Deutschland',
    color:'db-red',
    status:{
      topStopped:'Halt',
      topTransit:'Unterwegs',
      stopped:'Halt in {station}',
      transit:'Unterwegs - Nächster Halt: {station}'
    },
    stations:[
      {jp:'Freiburg',en:''},
      {jp:'Offenburg',en:''},
      {jp:'Hausach',en:''},
      {jp:'Freudenstadt',en:''},
      {jp:'Horb',en:''},
      {jp:'Tübingen',en:''}
    ]
  },
  regionale:{
    nameJp:'Regionale',
    nameEn:'Italia',
    color:'italia-dark',
    status:{
      topStopped:'Fermo',
      topTransit:'In corsa',
      stopped:'Fermo a {station}',
      transit:'In corsa - Prossima stazione: {station}'
    },
    stations:[
      {jp:'Como S. Giovanni',en:''},
      {jp:'Milano Centrale',en:''},
      {jp:'Brescia',en:''},
      {jp:'Verona Porta Nuova',en:''},
      {jp:'Padova',en:''},
      {jp:'Venezia S. Lucia',en:''}
    ]
  },
  donau:{
    nameJp:'Donau',
    nameEn:'Österreich',
    color:'donau-red',
    status:{
      topStopped:'Halt',
      topTransit:'Unterwegs',
      stopped:'Halt in {station}',
      transit:'Unterwegs - Nächster Halt: {station}'
    },
    stations:[
      {jp:'Wien FJB',en:''},
      {jp:'Heiligenstadt',en:''},
      {jp:'Klosterneuburg-Weidling',en:''},
      {jp:'Tulln',en:''},
      {jp:'Absdorf-Hippersdorf',en:''},
      {jp:'Krems',en:''}
    ]
  },
  sodra:{
    nameJp:'Södra',
    nameEn:'Sverige',
    color:'sodra-black',
    status:{
      topStopped:'Stopp',
      topTransit:'Under färd',
      stopped:'Stopp i {station}',
      transit:'Under färd - Nästa station: {station}'
    },
    stations:[
      {jp:'Stockholm',en:''},
      {jp:'Norrköping',en:''},
      {jp:'Linköping',en:''},
      {jp:'Nässjö',en:''},
      {jp:'Lund',en:''},
      {jp:'Malmö',en:''}
    ]
  },
  quebrada:{
    nameJp:'Quebrada',
    nameEn:'Jujuy',
    color:'quebrada-solar',
    status:{
      topStopped:'Detenido',
      topTransit:'En tránsito',
      stopped:'Detenido en {station}',
      transit:'En tránsito - Próxima estación: {station}'
    },
    stations:[
      {jp:'Volcán',en:''},
      {jp:'Tumbaya',en:''},
      {jp:'Purmamarca',en:''},
      {jp:'Posta de Hornillos',en:''},
      {jp:'Maimará',en:''},
      {jp:'Tilcara',en:''}
    ]
  },
  lupiche:{
    nameJp:'绿皮车',
    nameEn:'China',
    color:'lupiche',
    status:{
      topStopped:'停靠中',
      topTransit:'运行中',
      stopped:'停靠在{station}',
      transit:'运行中 · 下一站{station}'
    },
    stations:[
      {jp:'北京站',en:'Beijing'},
      {jp:'天津站',en:'Tianjin'},
      {jp:'唐山站',en:'Tangshan'},
      {jp:'秦皇岛站',en:'Qinhuangdao'},
      {jp:'山海关站',en:'Shanhaiguan'},
      {jp:'沈阳北站',en:'Shenyang North'}
    ]
  },
  konkan:{
    nameJp:'कोंकण',
    nameEn:'India',
    color:'konkan',
    status:{
      topStopped:'ठहरा हुआ',
      topTransit:'चल रहा है',
      stopped:'{station} पर ठहरा हुआ',
      transit:'चल रहा है · अगला स्टेशन {station}'
    },
    stations:[
      {jp:'रोहा',en:'Roha'},
      {jp:'रत्नागिरी',en:'Ratnagiri'},
      {jp:'कुडाल',en:'Kudal'},
      {jp:'मडगांव',en:'Madgaon'},
      {jp:'कारवार',en:'Karwar'},
      {jp:'उडुपी',en:'Udupi'}
    ]
  },
  commuter:{
    nameJp:'Commuter',
    nameEn:'Massachusetts',
    color:'commuter',
    status:{
      topStopped:'Stopped',
      topTransit:'In Transit',
      stopped:'Stopped at {station}',
      transit:'In transit · Next stop {station}'
    },
    stations:[
      {jp:'North Station',en:''},
      {jp:'Lynn',en:''},
      {jp:'Salem',en:''},
      {jp:'Beverly',en:''},
      {jp:'Ipswich',en:''},
      {jp:'Newburyport',en:''}
    ]
  }
};

let currentLine='yamanote';
let cfg={work:25,rest:5,journeys:4,longRest:35},timeLeft=cfg.work*60,running=false,ticker=null,clockTicker=null,currentJourney=0,phase='work',hasStarted=false,audioCtx=null,notifEnabled=false,isDark=false,timeMode='chronos',overtime=false,overtimeSeconds=0;
let stats={today:0,total:0,lastDate:new Date().toDateString(),history:[]};
let uiLocale='ja';

const UI_STRINGS={
  ja:{
    start:'開始', stop:'一時停止', paused:'一時停止中', next:'次へ', resume:'再開', reset:'終点',
    tabStats:'記録', tabTrip:'行程', tabSettings:'設定', tabAbout:'ヘルプ',
    travelLog:'記録', stops:'停車駅', today:'今日', allTime:'累計', min:'分',
    tripConfig:'行程設定', work:'作業（分）', break:'休憩（分）', longRest:'長い休憩（分）',
    systemSettings:'システム設定', mode:'モード', notifications:'通知', theme:'テーマ', language:'言語',
    notifOn:'ON', notifOff:'OFF',
    light:'ライト', dark:'ダーク',
    tripDuration:'終点までの所要時間: {duration}',
    about1:'日本の普通列車（futsū・普通）は、路線上のすべての駅に停車する各駅停車の列車です。',
    about2:'ポモドーロは、集中作業と短い休憩を繰り返す時間管理メソッドです。',
    about3:'Futsudoro は、列車の旅をモチーフにした深い集中のためのポモドーロタイマーです。Chronos（厳密）と Kairos（フロー重視）の2つのモードがあります。',
    about4:'❤️ + 🍀 with ishiroca + {anhdres}'
  },
  en:{
    start:'Start', stop:'Pause', paused:'Paused', next:'Next', resume:'Resume', reset:'Reset',
    tabStats:'Log', tabTrip:'Trip', tabSettings:'Settings', tabAbout:'Help',
    travelLog:'Log', stops:'Stops', today:'Today', allTime:'All Time', min:'min',
    tripConfig:'Trip Configuration', work:'Work (min)', break:'Break (min)', longRest:'Long Break (min)',
    systemSettings:'System Settings', mode:'Mode', notifications:'Notifications', theme:'Theme', language:'Language',
    notifOn:'ON', notifOff:'OFF',
    light:'Light', dark:'Dark',
    tripDuration:'Travel time to destination: {duration}',
    about1:'A futsū (普通) train in Japan is a local service that stops at every station on its route.',
    about2:'Pomodoro is a time management method based on focused work sessions and short breaks.',
    about3:'Futsudoro is a train pomodoro timer for deep work, with Chronos (strict timing) and Kairos (flow-friendly) modes.',
    about4:'Made with ❤️ + 🍀 by ishiroca + {anhdres}'
  },
  es:{
    start:'Iniciar', stop:'Pausar', paused:'En pausa', next:'Siguiente', resume:'Retomar', reset:'Reiniciar',
    tabStats:'Diario', tabTrip:'Viaje', tabSettings:'Ajustes', tabAbout:'Ayuda',
    travelLog:'Diario', stops:'Paradas', today:'Hoy', allTime:'Total', min:'min',
    tripConfig:'Configuración del viaje', work:'Trabajo (min)', break:'Descanso (min)', longRest:'Descanso largo (min)',
    systemSettings:'Ajustes del sistema', mode:'Modo', notifications:'Notificaciones', theme:'Tema', language:'Idioma',
    notifOn:'SI', notifOff:'NO',
    light:'Claro', dark:'Oscuro',
    tripDuration:'Tiempo de viaje al destino: {duration}',
    about1:'Un tren futsū (普通) en Japón es un servicio local que se detiene en todas las estaciones del recorrido.',
    about2:'Pomodoro es un método de gestión del tiempo basado en sesiones de trabajo enfocadas y descansos cortos.',
    about3:'Futsudoro es un temporizador pomodoro inspirado en trenes para trabajo profundo, con modos Chronos (estricto) y Kairos (fluido).',
    about4:'Hecho con ❤️ + 🍀 por ishiroca + {anhdres}'
  },
  it:{
    start:'Avvia', stop:'Pausa', paused:'In pausa', next:'Avanti', resume:'Riprendi', reset:'Reimposta',
    tabStats:'Diario', tabTrip:'Viaggio', tabSettings:'Opzioni', tabAbout:'Aiuto',
    travelLog:'Diario', stops:'Fermate', today:'Oggi', allTime:'Totale', min:'min',
    tripConfig:'Configurazione viaggio', work:'Lavoro (min)', break:'Pausa (min)', longRest:'Pausa lunga (min)',
    systemSettings:'Impostazioni sistema', mode:'Modalità', notifications:'Notifiche', theme:'Tema', language:'Lingua',
    notifOn:'SI', notifOff:'NO',
    light:'Chiaro', dark:'Scuro',
    tripDuration:'Tempo di viaggio fino al capolinea: {duration}',
    about1:'Un treno futsū (普通) in Giappone è un servizio locale che si ferma in tutte le stazioni della linea.',
    about2:'Pomodoro è un metodo di gestione del tempo basato su sessioni di lavoro concentrato e brevi pause.',
    about3:'Futsudoro è un timer pomodoro ispirato ai treni per il lavoro profondo, con modalità Chronos (rigida) e Kairos (fluida).',
    about4:'Creato con ❤️ + 🍀 da ishiroca + {anhdres}'
  },
  de:{
    start:'Los', stop:'Pause', paused:'Pausiert', next:'Weiter', resume:'Fortsetzen', reset:'Zurücksetzen',
    tabStats:'Log', tabTrip:'Fahrt', tabSettings:'Optionen', tabAbout:'Hilfe',
    travelLog:'Log', stops:'Halte', today:'Heute', allTime:'Gesamt', min:'min',
    tripConfig:'Fahrtkonfiguration', work:'Arbeit (min)', break:'Pause (min)', longRest:'Lange Pause (min)',
    systemSettings:'Systemeinstellungen', mode:'Modus', notifications:'Benachrichtigungen', theme:'Thema', language:'Sprache',
    notifOn:'JA', notifOff:'NEIN',
    light:'Hell', dark:'Dunkel',
    tripDuration:'Fahrzeit bis zum Ziel: {duration}',
    about1:'Ein futsū-Zug (普通) in Japan ist ein Nahverkehrszug, der an jeder Station hält.',
    about2:'Pomodoro ist eine Zeitmanagement-Methode mit fokussierten Arbeitsphasen und kurzen Pausen.',
    about3:'Futsudoro ist ein zug-inspirierter Pomodoro-Timer für Deep Work mit Chronos- (streng) und Kairos-Modus (flow-freundlich).',
    about4:'Mit ❤️ + 🍀 von ishiroca + {anhdres}'
  },
  hi:{
    start:'शुरू', stop:'रोकें', paused:'रुका हुआ', next:'अगला', resume:'जारी रखें', reset:'रीसेट',
    tabStats:'लॉग', tabTrip:'यात्रा', tabSettings:'सेटिंग्स', tabAbout:'मदद',
    travelLog:'लॉग', stops:'स्टॉप', today:'आज', allTime:'कुल', min:'मिनट',
    tripConfig:'यात्रा कॉन्फ़िगरेशन', work:'काम (मिन)', break:'ब्रेक (मिन)', longRest:'लंबा ब्रेक (मिन)',
    systemSettings:'सिस्टम सेटिंग्स', mode:'मोड', notifications:'सूचनाएँ', theme:'थीम', language:'भाषा',
    notifOn:'हाँ', notifOff:'नहीं',
    light:'लाइट', dark:'डार्क',
    tripDuration:'गंतव्य तक यात्रा समय: {duration}',
    about1:'जापान में futsū (普通) ट्रेन एक लोकल सेवा है जो अपने मार्ग के हर स्टेशन पर रुकती है।',
    about2:'Pomodoro समय प्रबंधन की एक विधि है जिसमें केंद्रित काम और छोटे ब्रेक शामिल होते हैं।',
    about3:'Futsudoro एक ट्रेन-प्रेरित Pomodoro टाइमर है, गहरे काम के लिए, जिसमें Chronos (सख्त) और Kairos (लचीला) मोड हैं।',
    about4:'❤️ + 🍀 के साथ ishiroca + {anhdres} द्वारा बनाया गया'
  },
  fr:{
    start:'Démarrer', stop:'Pause', paused:'En pause', next:'Suivant', resume:'Reprendre', reset:'Réinitialiser',
    tabStats:'Journal', tabTrip:'Trajet', tabSettings:'Réglages', tabAbout:'Aide',
    travelLog:'Journal', stops:'Arrêts', today:'Aujourd’hui', allTime:'Total', min:'min',
    tripConfig:'Configuration du trajet', work:'Travail (min)', break:'Pause (min)', longRest:'Pause longue (min)',
    systemSettings:'Paramètres système', mode:'Mode', notifications:'Notifications', theme:'Thème', language:'Langue',
    notifOn:'OUI', notifOff:'NON',
    light:'Clair', dark:'Sombre',
    tripDuration:'Temps de trajet jusqu’au terminus : {duration}',
    about1:'Un train futsū (普通) au Japon est un service local qui s’arrête à chaque station de la ligne.',
    about2:'Pomodoro est une méthode de gestion du temps basée sur des sessions de travail concentré et de courtes pauses.',
    about3:'Futsudoro est un minuteur pomodoro inspiré des trains pour le travail profond, avec les modes Chronos (strict) et Kairos (fluide).',
    about4:'Créé avec ❤️ + 🍀 par ishiroca + {anhdres}'
  },
  sv:{
    start:'Starta', stop:'Pausa', paused:'Pausad', next:'Nästa', resume:'Fortsätt', reset:'Återställ',
    tabStats:'Logg', tabTrip:'Resa', tabSettings:'Val', tabAbout:'Hjälp',
    travelLog:'Logg', stops:'Stopp', today:'Idag', allTime:'Totalt', min:'min',
    tripConfig:'Reseinställningar', work:'Arbete (min)', break:'Paus (min)', longRest:'Lång paus (min)',
    systemSettings:'Systeminställningar', mode:'Läge', notifications:'Notiser', theme:'Tema', language:'Språk',
    notifOn:'JA', notifOff:'NEJ',
    light:'Ljust', dark:'Mörkt',
    tripDuration:'Restid till slutstation: {duration}',
    about1:'Ett futsū-tåg (普通) i Japan är en lokaltågslinje som stannar vid varje station.',
    about2:'Pomodoro är en metod för tidshantering med fokuserade arbetspass och korta pauser.',
    about3:'Futsudoro är en tåg-inspirerad pomodoro-timer för djupt arbete med lägena Chronos (strikt) och Kairos (flödesvänligt).',
    about4:'Skapad med ❤️ + 🍀 av ishiroca + {anhdres}'
  },
  pt:{
    start:'Iniciar', stop:'Pausar', paused:'Em pausa', next:'Próximo', resume:'Retomar', reset:'Reiniciar',
    tabStats:'Registro', tabTrip:'Viagem', tabSettings:'Ajustes', tabAbout:'Sobre',
    travelLog:'Registro', stops:'Paradas', today:'Hoje', allTime:'Total', min:'min',
    tripConfig:'Configuração da viagem', work:'Trabalho (min)', break:'Pausa (min)', longRest:'Pausa longa (min)',
    systemSettings:'Configurações do sistema', mode:'Modo', notifications:'Notificações', theme:'Tema', language:'Idioma',
    notifOn:'SIM', notifOff:'NÃO',
    light:'Claro', dark:'Escuro',
    tripDuration:'Tempo de viagem até o destino: {duration}',
    about1:'Um trem futsū (普通) no Japão é um serviço local que para em todas as estações da linha.',
    about2:'Pomodoro é um método de gestão de tempo baseado em sessões de trabalho focado e pausas curtas.',
    about3:'Futsudoro é um temporizador pomodoro inspirado em trens para trabalho profundo, com modos Chronos (rígido) e Kairos (fluxo).',
    about4:'Feito com ❤️ + 🍀 por ishiroca + {anhdres}'
  }
};

function t(key){
  return (UI_STRINGS[uiLocale]&&UI_STRINGS[uiLocale][key])||UI_STRINGS.ja[key]||key;
}

function normalizeLineKey(raw){
  if(!raw) return 'yamanote';
  const key=String(raw).toLowerCase();
  if(LINES[key]) return key;
  const decoded=decodeURIComponent(String(raw));
  if(LINES[decoded]) return decoded;
  // Fallback defensivo para slugs legacy/no ASCII: priorizar línea válida en vez de romper UI.
  if(/[^a-z0-9-]/i.test(decoded)) return 'lupiche';
  return 'yamanote';
}

function routeSlugFor(line){
  const routeSlugs={
    yamanote:'yamanote',
    urquiza:'urquiza',
    nagareyama:'nagareyama',
    ter:'ter',
    schwarzwaldbahn:'schwarzwaldbahn',
    regionale:'regionale',
    donau:'donau',
    sodra:'sodra',
    quebrada:'quebrada',
    lupiche:'lupiche',
    konkan:'konkan',
    commuter:'commuter'
  };
  const safe=normalizeLineKey(line);
  return routeSlugs[safe]||'yamanote';
}

function buildRoutePath(line=currentLine,mode=timeMode){
  return `/${encodeURIComponent(routeSlugFor(line))}/${mode}`;
}

function syncRoute(){
  const next=buildRoutePath();
  if(window.location.pathname!==next){
    window.history.replaceState({},'',next);
  }
}

function applyRouteFromPath(){
  const validModes=['chronos','kairos'];
  const segments=window.location.pathname
    .split('/')
    .filter(Boolean)
    .map(s=>decodeURIComponent(s).toLowerCase());

  let routeLine=null;
  let routeMode=null;

  segments.forEach(seg=>{
    if(validModes.includes(seg)){
      routeMode=seg;
      return;
    }
    if(LINES[seg]){
      routeLine=seg;
      return;
    }
    // Fallback defensivo para slugs viejos/no ASCII
    if(/[^a-z0-9-]/i.test(seg)){
      routeLine='lupiche';
    }
  });

  if(routeLine) currentLine=routeLine;
  if(routeMode) timeMode=routeMode;
}

const timerEl=document.getElementById('timer'),statusTextEl=document.getElementById('statusText'),statusIconEl=document.getElementById('statusIcon'),tpEl=document.getElementById('trackProgress'),trainInd=document.getElementById('trainIndicator');
const lineBtn=document.getElementById('lineBtn'),lineDropdown=document.getElementById('lineDropdown'),lineNameJp=document.getElementById('lineNameJp'),lineNameEn=document.getElementById('lineNameEn');

function detectLocale(){
  const saved=localStorage.getItem('futsuUiLocale');
  if(saved && UI_STRINGS[saved]) return saved;
  const lang=(navigator.language||'ja').toLowerCase();
  if(lang.startsWith('es')) return 'es';
  if(lang.startsWith('en')) return 'en';
  if(lang.startsWith('it')) return 'it';
  if(lang.startsWith('de')) return 'de';
  if(lang.startsWith('hi')) return 'hi';
  if(lang.startsWith('fr')) return 'fr';
  if(lang.startsWith('sv')) return 'sv';
  if(lang.startsWith('pt')) return 'pt';
  return 'ja';
}

function applyUIText(){
  const set=(id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val; };
  set('resetBtnLabel',t('reset'));
  set('tabStats',t('tabStats')); set('tabTrip',t('tabTrip')); set('tabSettings',t('tabSettings')); set('tabAbout',t('tabAbout'));
  set('titleTravelLog',t('travelLog')); set('labelStops',t('stops')); set('labelToday',t('today')); set('labelAllTime',t('allTime'));
  set('labelMinA',t('min')); set('labelMinB',t('min'));
  set('titleTripConfig',t('tripConfig')); set('labelStopsCfg',t('stops')); set('labelWork',t('work')); set('labelBreak',t('break')); set('labelLongRest',t('longRest'));
  set('titleSettings',t('systemSettings')); set('labelMode',t('mode')); set('labelNotifications',t('notifications')); set('labelTheme',t('theme')); set('labelLanguage',t('language'));
  set('aboutText1',t('about1')); set('aboutText2',t('about2')); set('aboutText3',t('about3'));
  const about4El=document.getElementById('aboutText4');
  if(about4El){
    about4El.innerHTML=t('about4').replace('{anhdres}','<a href="https://anhdres.com" target="_blank" rel="noopener noreferrer">anhdres</a>');
  }
  document.getElementById('langSelect').value=uiLocale;
  refreshThemeButton();
  updNotifBtn();
  updTripDurationNote();
  updBtns();
}

function setLocale(next){
  if(!UI_STRINGS[next]) return;
  uiLocale=next;
  localStorage.setItem('futsuUiLocale',next);
  applyUIText();
}

function getStations(){return LINES[currentLine].stations;}
function stationLabel(i){
  const stations=getStations();
  const idx=Math.max(0,Math.min(i,stations.length-1));
  const st=stations[idx];
  return st.jp;
}
function fmtTpl(tpl,station){
  return (tpl||'').replace('{station}',station);
}
function getStatusCopy(isTransit){
  const status=LINES[currentLine].status||{};
  const station=isTransit?stationLabel(currentJourney+1):stationLabel(currentJourney);
  if(isTransit){
    return {
      top:status.topTransit||'In Transit',
      main:fmtTpl(status.transit||'In Transit - Next station: {station}',station)
    };
  }
  return {
    top:status.topStopped||'Stopped',
    main:fmtTpl(status.stopped||'Stopped at {station} Station',station)
  };
}

function selectLine(lineKey){
  currentLine=normalizeLineKey(lineKey);
  const line=LINES[currentLine];
  trackEvent('Line Changed',{line:currentLine});
  syncRoute();
  lineNameJp.textContent=line.nameJp;
  lineNameEn.textContent=line.nameEn;
  // Update train color
  trainInd.className='train-indicator '+line.color;
  // Update dropdown selection
  document.querySelectorAll('.line-option').forEach(opt=>{
    opt.classList.toggle('selected',normalizeLineKey(opt.dataset.line)===currentLine);
  });
  lineDropdown.classList.remove('open');
  // Reset with new stations
  fullReset();
}

// Line selector events
lineBtn.onclick=()=>lineDropdown.classList.toggle('open');
document.querySelectorAll('.line-option').forEach(opt=>{
  opt.onclick=()=>selectLine(opt.dataset.line);
});
// Close dropdown when clicking outside
document.addEventListener('click',(e)=>{
  if(!e.target.closest('.line-selector'))lineDropdown.classList.remove('open');
});

function loadStats(){let s=localStorage.getItem('futsuStats');if(s){stats=JSON.parse(s);const todayKey=new Date().toDateString();if(stats.lastDate!==todayKey){if(!stats.history)stats.history=[];if(stats.today>0){stats.history.push({date:stats.lastDate,minutes:stats.today});if(stats.history.length>30)stats.history=stats.history.slice(-30)}stats.today=0;stats.lastDate=todayKey}}if(!stats.history)stats.history=[];updStatsUI()}
function saveStats(){localStorage.setItem('futsuStats',JSON.stringify(stats))}
function updStatsUI(){document.getElementById('stToday').textContent=stats.today;document.getElementById('stTotal').textContent=stats.total;document.getElementById('curJ').textContent=Math.min(currentJourney+1,cfg.journeys);document.getElementById('totJ').textContent=cfg.journeys;renderSparkline()}
function renderSparkline(){const svg=document.getElementById('statsSparkline');if(!svg||!stats.history)return;const days=[];const today=new Date();for(let i=13;i>=0;i--){const d=new Date(today);d.setDate(today.getDate()-i);const key=d.toDateString();const entry=stats.history.find(h=>h.date===key);days.push({date:key,minutes:entry?entry.minutes:0,isToday:i===0})}const maxMin=Math.max(...days.map(d=>d.minutes),1);const barWidth=8;const gap=2;const padTop=3;const padBottom=3;const innerH=32-padTop-padBottom;let bars='';days.forEach((d,i)=>{const h=Math.max((d.minutes/maxMin)*innerH,d.minutes>0?1:0);const x=i*(barWidth+gap);const y=32-padBottom-h;const fill=d.isToday?'var(--green)':(d.minutes>0?'var(--green)':'var(--line)');const opacity=d.isToday?1:(d.minutes>0?0.7:1);bars+=`<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="${fill}" opacity="${opacity}" rx="1"/>`});svg.innerHTML=bars}
function addWork(m){stats.today+=m;stats.total+=m;saveStats();updStatsUI()}
function refreshThemeButton(){
  const btn=document.getElementById('themeBtn');
  btn.textContent=isDark?t('dark'):t('light');
  btn.classList.toggle('on',isDark);
}
function loadTheme(){if(localStorage.getItem('futsuTheme')==='dark'){isDark=true;document.body.classList.add('dark');} refreshThemeButton();}
document.getElementById('themeBtn').onclick=()=>{isDark=!isDark;document.body.classList.toggle('dark');refreshThemeButton();localStorage.setItem('futsuTheme',isDark?'dark':'light')};
function updModeBtn(){
  const b=document.getElementById('modeBtn');
  b.textContent=timeMode==='kairos'?'Kairos':'Chronos';
  b.classList.toggle('on',timeMode==='kairos');
}
function loadMode(){
  const saved=localStorage.getItem('futsuTimeMode');
  if(saved==='kairos'||saved==='chronos') timeMode=saved;
  updModeBtn();
}
function toggleMode(){
  timeMode=timeMode==='chronos'?'kairos':'chronos';
  localStorage.setItem('futsuTimeMode',timeMode);
  syncRoute();
  fullReset();
  updModeBtn();
}
document.getElementById('modeBtn').onclick=toggleMode;

function trackEvent(name,data){
  try{
    if(typeof window.va==='function'){
      window.va('event',{name,data:data||{}});
    }
  }catch(_e){}
}

function initAudio(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume()}
function tone(f,t,d){let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.frequency.value=f;g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+d);o.start(t);o.stop(t+d+0.05)}
function chimeGo(){initAudio();let t=audioCtx.currentTime;tone(523.25,t,.4);tone(659.25,t+.15,.5);tone(783.99,t+.35,.6)}
function chimeArr(){initAudio();let t=audioCtx.currentTime;tone(783.99,t,.35);tone(659.25,t+.12,.4);tone(523.25,t+.28,.5);tone(440,t+.5,.6)}
function chimeLong(){initAudio();let t=audioCtx.currentTime;tone(523.25,t,.3);tone(659.25,t+.15,.3);tone(783.99,t+.3,.4);tone(1046.5,t+.5,.6);setTimeout(()=>{let t2=audioCtx.currentTime;tone(783.99,t2,.3);tone(659.25,t2+.15,.5)},600)}
function chimeEnd(){initAudio();let t=audioCtx.currentTime;[523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,t+i*.12,.4));setTimeout(()=>{let t2=audioCtx.currentTime;[1046.5,783.99,659.25,523.25].forEach((f,i)=>tone(f,t2+i*.12,.4))},700)}
async function toggleNotif(){if(!('Notification'in window))return;if(notifEnabled){notifEnabled=false;localStorage.removeItem('futsuNotif');updNotifBtn();return;}let p=await Notification.requestPermission();notifEnabled=p==='granted';if(notifEnabled)localStorage.setItem('futsuNotif','1');updNotifBtn()}
function updNotifBtn(){let b=document.getElementById('notifBtn');b.textContent=notifEnabled?t('notifOn'):t('notifOff');b.classList.toggle('on',notifEnabled)}
function loadNotif(){if('Notification' in window && localStorage.getItem('futsuNotif')&&Notification.permission==='granted')notifEnabled=true}
function sendNotif(t,b){if(notifEnabled&&document.hidden)new Notification(t,{body:b})}
document.getElementById('notifBtn').onclick=toggleNotif;

const trackEl=document.getElementById('track');
function buildStations(){trackEl.querySelectorAll('.station').forEach(e=>e.remove());let n=cfg.journeys+1;getStations().slice(0,n).forEach((st,i)=>{let d=document.createElement('div');d.className='station';d.innerHTML='<div class="station-dot"></div><div class="station-name"><span class="station-name-jp">'+st.jp+'</span>'+(st.en?'<span class="station-name-en">'+st.en+'</span>':'')+'</div>';trackEl.appendChild(d)})}
function updStations(){
  let stations=trackEl.querySelectorAll('.station');
  stations.forEach((el,i)=>{
    el.classList.remove('active','done');

    if(!hasStarted){
      if(i===currentJourney)el.classList.add('active');
      return;
    }

    if(i < currentJourney || (phase === 'work' && i === currentJourney)){
      // Estaciones completadas: las que están atrás + la actual si estamos en viaje
      el.classList.add('done');
    } else if(i === currentJourney && phase !== 'work'){
      // Estación actual solo cuando estamos parados (rest/longrest)
      el.classList.add('active');
    }
    // Si i > currentJourney: estación futura (sin color)
  });
}
function updTrainState(){if(phase==='work'&&running){trainInd.classList.add('moving');trainInd.classList.remove('doors-open');}else{trainInd.classList.remove('moving');trainInd.classList.add('doors-open');}}
function workProg(){return(cfg.work*60-timeLeft)/(cfg.work*60)}
function totalProg(){return Math.min(1,(currentJourney+workProg())/cfg.journeys)}
function fmt(s){let m=Math.floor(s/60),sec=s%60;return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0')}
function fmtOvertime(s){let m=Math.floor(s/60),sec=s%60;return '+'+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0')}

function updAnalogClock(){
  const now = new Date();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360;

  document.getElementById('secondHand').style.transform = 'rotate(' + secondDeg + 'deg)';
  document.getElementById('minuteHand').style.transform = 'rotate(' + minuteDeg + 'deg)';
  document.getElementById('hourHand').style.transform = 'rotate(' + hourDeg + 'deg)';
}
function updDisplay(){
  timerEl.textContent=(timeMode==='kairos'&&overtime)?fmtOvertime(overtimeSeconds):fmt(timeLeft);
  if(phase==='work'){tpEl.style.width=(totalProg()*100)+'%';}
  else if(phase==='longrest'){tpEl.style.width='100%';}
  else if(!hasStarted){tpEl.style.width='0%';}
  updTrainState();

  if(!hasStarted || phase==='rest' || phase==='longrest'){
    const copy=getStatusCopy(false);
    statusTextEl.textContent=copy.main;
    statusTextEl.classList.add('status-station');
    statusTextEl.classList.remove('status-transit');
    statusIconEl.textContent='subway_walk';
    statusIconEl.classList.add('status-station');
    statusIconEl.classList.remove('status-transit');
  }else if(phase==='work'){
    const copy=getStatusCopy(true);
    statusTextEl.textContent=copy.main;
    statusTextEl.classList.add('status-transit');
    statusTextEl.classList.remove('status-station');
    statusIconEl.textContent='directions_subway';
    statusIconEl.classList.add('status-transit');
    statusIconEl.classList.remove('status-station');
  }

  updStations();updStatsUI();
}

const startBtn=document.getElementById('startBtn'),resetBtn=document.getElementById('resetBtn');
const startIconEl=startBtn.querySelector('.ctrl-icon'),startLabelEl=startBtn.querySelector('span:last-child');
function phaseTargetSeconds(){
  if(phase==='work') return cfg.work*60;
  if(phase==='rest') return cfg.rest*60;
  return cfg.longRest*60;
}
function addWorkFromPhase(){
  const totalSecs=(cfg.work*60)+(overtime?overtimeSeconds:0);
  addWork(Math.max(1,Math.round(totalSecs/60)));
}
function enterOvertime(){
  overtime=true;
  overtimeSeconds=0;
  if(phase==='work'){
    chimeArr();
    sendNotif('Futsu-doro','Preset complete. Continue or move to next stop.');
  }else{
    chimeGo();
    sendNotif('Futsu-doro','Break preset complete. Press ready when you want to continue.');
  }
}
function advancePhase(){
  if(phase==='work'){
    currentJourney++;
    overtime=false;
    overtimeSeconds=0;
    if(currentJourney>=cfg.journeys){
      phase='longrest';
      timeLeft=cfg.longRest*60;
      chimeLong();
      sendNotif('Futsu-doro','終点。Final Destination '+cfg.longRest+' min.');
    }else{
      phase='rest';
      timeLeft=cfg.rest*60;
      chimeArr();
      sendNotif('Futsu-doro','At station '+getStations()[currentJourney].jp+'. '+cfg.rest+' min rest.');
    }
    return true;
  }
  if(phase==='rest'){
    overtime=false;
    overtimeSeconds=0;
    phase='work';
    timeLeft=cfg.work*60;
    chimeGo();
    sendNotif('Futsu-doro','Departing. '+cfg.work+' min of work.');
    return true;
  }
  if(phase==='longrest'){
    chimeEnd();
    sendNotif('Futsu-doro','Session complete. Resetting.');
    setTimeout(fullReset,800);
    return false;
  }
  return false;
}
function tick(){
  if(timeMode==='kairos' && overtime){
    overtimeSeconds++;
    updDisplay();
    updBtns();
    return;
  }
  timeLeft--;
  if(timeLeft<=0){
    timeLeft=0;
    if(timeMode==='kairos'){
      enterOvertime();
      updDisplay();
      updBtns();
      return;
    }
    clearInterval(ticker);
    running=false;
    if(phase==='work') addWork(cfg.work);
    const shouldContinue=advancePhase();
    if(shouldContinue) startTimer();
    updDisplay();
    updBtns();
    return;
  }
  updDisplay();
}
function startTimer(){if(running)return;running=true;ticker=setInterval(tick,1000);updDisplay();updBtns()}
function pauseTimer(){if(!running)return;running=false;clearInterval(ticker);updDisplay();updBtns()}
function fullReset(){pauseTimer();phase='work';hasStarted=false;currentJourney=0;timeLeft=cfg.work*60;overtime=false;overtimeSeconds=0;buildStations();tpEl.style.width='0%';document.getElementById('secondHand').style.transform='rotate(0deg)';document.getElementById('minuteHand').style.transform='rotate(0deg)';document.getElementById('hourHand').style.transform='rotate(0deg)';updDisplay();updBtns()}
function updBtns(){
  const waitingKairos=timeMode==='kairos'&&overtime;
  const pausedState=!running&&hasStarted&&!waitingKairos;
  startBtn.disabled=false;
  startBtn.classList.toggle('ready',waitingKairos);
  startBtn.classList.toggle('start',running&&!waitingKairos);
  startBtn.classList.toggle('paused-state',pausedState);

  if(waitingKairos){
    startIconEl.textContent='fast_forward';
    startLabelEl.textContent=(phase==='work')?t('next'):t('resume');
    return;
  }

  if(pausedState){
    startIconEl.textContent='pause';
    startLabelEl.textContent=t('paused');
  }else if(running){
    startIconEl.textContent='pause';
    startLabelEl.textContent=t('stop');
  }else{
    startIconEl.textContent='play_arrow';
    startLabelEl.textContent=t('start');
  }
}
function fmtDuration(mins){
  const h=Math.floor(mins/60);
  const m=mins%60;
  if(h>0 && m>0) return `${h}h ${m}m`;
  if(h>0) return `${h}h`;
  return `${m}m`;
}
function updTripDurationNote(){
  const totalToFinalRest=(cfg.work*cfg.journeys)+(cfg.rest*Math.max(0,cfg.journeys-1));
  const note=document.getElementById('tripDurationNote');
  if(note) note.textContent=t('tripDuration').replace('{duration}',fmtDuration(totalToFinalRest));
}
function applyCfg(){
  cfg.work=+document.getElementById('inWork').value||25;
  cfg.rest=+document.getElementById('inRest').value||5;
  cfg.journeys=Math.min(5,Math.max(2,+document.getElementById('inJourneys').value||4));
  document.getElementById('inJourneys').value=cfg.journeys;
  cfg.longRest=+document.getElementById('inLong').value||35;
  updTripDurationNote();
}
['inWork','inRest','inJourneys','inLong'].forEach(id=>{document.getElementById(id).addEventListener('change',()=>{applyCfg();if(!running)fullReset()})});
function togglePanel(id){let panels=['statsPanel','tripPanel','settingsPanel','aboutPanel'],btns=['statsBtn','tripBtn','settingsBtn','aboutBtn'],i=panels.indexOf(id);panels.forEach((p,j)=>{let isOpen=j===i&&!document.getElementById(p).classList.contains('open');document.getElementById(p).classList.toggle('open',isOpen);document.getElementById(btns[j]).classList.toggle('active',isOpen)})}
document.getElementById('statsBtn').onclick=()=>togglePanel('statsPanel');
document.getElementById('tripBtn').onclick=()=>togglePanel('tripPanel');
document.getElementById('settingsBtn').onclick=()=>togglePanel('settingsPanel');
document.getElementById('aboutBtn').onclick=()=>togglePanel('aboutPanel');
startBtn.onclick=()=>{
  if(timeMode==='kairos'&&overtime){
    if(phase==='work') addWorkFromPhase();
    advancePhase();
    updDisplay();
    updBtns();
    return;
  }
  if(running){
    setTimeout(pauseTimer,70);
    return;
  }
  if(!hasStarted){hasStarted=true;phase='work';chimeGo();}
  startTimer();
};
resetBtn.onclick=fullReset;

function startClock(){
  if(clockTicker) clearTimeout(clockTicker);
  const loop=()=>{
    updAnalogClock();
    const delay=1000-(Date.now()%1000);
    clockTicker=setTimeout(loop,delay);
  };
  loop();
}

uiLocale=detectLocale();
loadStats();
loadTheme();
loadMode();
loadNotif();
applyRouteFromPath();

document.getElementById('langSelect').addEventListener('change',(e)=>setLocale(e.target.value));

// Aplica UI de línea/modo según URL limpia
if(LINES[currentLine]){
  const line=LINES[currentLine];
  lineNameJp.textContent=line.nameJp;
  lineNameEn.textContent=line.nameEn;
  trainInd.className='train-indicator '+line.color;
  document.querySelectorAll('.line-option').forEach(opt=>{
    opt.classList.toggle('selected',opt.dataset.line===currentLine);
  });
}
updModeBtn();
syncRoute();

buildStations();
applyUIText();
updDisplay();
updBtns();
updNotifBtn();
updTripDurationNote();
startClock();
window.addEventListener('pageshow',updAnalogClock);
document.addEventListener('visibilitychange',()=>{ if(!document.hidden) startClock(); });
if('serviceWorker' in navigator){
  window.addEventListener('load', async ()=>{
    try{
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.unregister()));
    }catch(_e){}
  });
}
