// Version stamping for the UI ("Help" panel + window.futsudoroVersion).
// VERSION: semver, bumped manually on meaningful releases (e.g. 0.2.0 → 0.3.0).
// BUILD:   git short SHA, auto-updated by scripts/bump-version.sh on every commit.
// BUILD_DATE: ISO date of the commit, also auto-updated.
// 0.5.0 — 2026-07-21: stats export (CSV/JSON) — @serhack feedback.
// 0.4.1 — 2026-07-21: revert DE voice (SweetLady), regenerate ALL 99 wavs
//                     (27 prefijos + 72 estaciones) con filter chain v5 para
//                     asegurar consistencia (los anteriores eran hibridos
//                     entre casting 0.3.0 y 0.4.0).
// 0.4.0 — 2026-07-21: PA voice casting — user picked alternatives for en/es/de/zh.
//                     en: English_SereneWoman → English_CalmWoman
//                     es: Spanish_SereneWoman → Spanish_SophisticatedLady
//                     de: German_SweetLady → German_FriendlyMan (mujer → hombre)
//                     zh: Chinese (Mandarin)_Soft_Girl → Wise_Women
// 0.3.0 — 2026-07-21: PA station announcements (TTS + chime + i18n label),
//                     timer robustness (timestamp-based), zh translation added.
export const VERSION = '0.5.0';
export const BUILD = '03d251d';
export const BUILD_DATE = '2026-07-21';

// Line configurations with JP + Latin station names
export const LINES={
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
    badgeColor:'#C97A3D',
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

export const UI_STRINGS={
  ja:{
    start:'開始', stop:'一時停止', paused:'一時停止中', next:'次へ', resume:'再開', reset:'終点',
    tabStats:'記録', tabTrip:'行程', tabSettings:'設定', tabAbout:'ヘルプ',
    travelLog:'記録', stops:'停車駅', today:'今日', allTime:'累計', min:'分',
    tripConfig:'行程設定', work:'作業（分）', break:'休憩（分）', longRest:'長い休憩（分）',
    systemSettings:'システム設定', mode:'モード', notifications:'通知', theme:'テーマ', language:'言語',
    stationAnnouncements:'駅アナウンス',
    notifOn:'ON', notifOff:'OFF',
    light:'ライト', dark:'ダーク',
    tripDuration:'終点までの所要時間: {duration}',
    exportLabel:'エクスポート',
    confirmSwitchLine:'路線を切り替えると進行中のセッションがリセットされます。よろしいですか？',
    about1:'日本の普通列車（futsū・普通）は、路線上のすべての駅に停車する各駅停車の列車です。',
    about2:'ポモドーロは、集中作業と短い休憩を繰り返す時間管理メソッドです。',
    about3:'Futsudoro は、列車の旅をモチーフにした深い集中のためのポモドーロタイマーです。Chronos（厳密）と Kairos（フロー重視）の2つのモードがあります。',
    about4:'❤️ + 🍀 ishiroca + {anhdres} による'
  },
  en:{
    start:'Start', stop:'Pause', paused:'Paused', next:'Next', resume:'Resume', reset:'Reset',
    tabStats:'Log', tabTrip:'Trip', tabSettings:'Settings', tabAbout:'Help',
    travelLog:'Log', stops:'Stops', today:'Today', allTime:'All Time', min:'min',
    tripConfig:'Trip Configuration', work:'Work (min)', break:'Break (min)', longRest:'Long Break (min)',
    systemSettings:'System Settings', mode:'Mode', notifications:'Notifications', theme:'Theme', language:'Language',
    stationAnnouncements:'Station Announcements',
    notifOn:'ON', notifOff:'OFF',
    light:'Light', dark:'Dark',
    tripDuration:'Travel time to destination: {duration}',
    exportLabel:'Export',
    confirmSwitchLine:'Switching lines will reset the current session. Continue?',
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
    stationAnnouncements:'Anuncios de estación',
    notifOn:'SI', notifOff:'NO',
    light:'Claro', dark:'Oscuro',
    tripDuration:'Tiempo de viaje al destino: {duration}',
    exportLabel:'Exportar',
    confirmSwitchLine:'Cambiar de línea reiniciará la sesión actual. ¿Continuar?',
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
    stationAnnouncements:'Annunci di stazione',
    notifOn:'SI', notifOff:'NO',
    light:'Chiaro', dark:'Scuro',
    tripDuration:'Tempo di viaggio fino al capolinea: {duration}',
    exportLabel:'Esporta',
    confirmSwitchLine:'Cambiare linea resetterà la sessione attuale. Continuare?',
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
    stationAnnouncements:'Bahnsteigansagen',
    notifOn:'JA', notifOff:'NEIN',
    light:'Hell', dark:'Dunkel',
    tripDuration:'Fahrzeit bis zum Ziel: {duration}',
    exportLabel:'Exportieren',
    confirmSwitchLine:'Linie wechseln setzt die aktuelle Sitzung zurück. Fortfahren?',
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
    stationAnnouncements:'स्टेशन की घोषणाएँ',
    notifOn:'हाँ', notifOff:'नहीं',
    light:'लाइट', dark:'डार्क',
    tripDuration:'गंतव्य तक यात्रा समय: {duration}',
    exportLabel:'निर्यात',
    confirmSwitchLine:'लाइन बदलने से वर्तमान सत्र रीसेट हो जाएगा। जारी रखें?',
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
    stationAnnouncements:'Annonces en gare',
    notifOn:'OUI', notifOff:'NON',
    light:'Clair', dark:'Sombre',
    tripDuration:'Temps de trajet jusqu’au terminus : {duration}',
    exportLabel:'Exporter',
    confirmSwitchLine:'Changer de ligne réinitialisera la session en cours. Continuer ?',
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
    stationAnnouncements:'Stationsmeddelanden',
    notifOn:'JA', notifOff:'NEJ',
    light:'Ljust', dark:'Mörkt',
    tripDuration:'Restid till slutstation: {duration}',
    exportLabel:'Exportera',
    confirmSwitchLine:'Att byta linje återställer den pågående sessionen. Fortsätt?',
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
    stationAnnouncements:'Anúncios de estação',
    notifOn:'SIM', notifOff:'NÃO',
    light:'Claro', dark:'Escuro',
    tripDuration:'Tempo de viagem até o destino: {duration}',
    exportLabel:'Exportar',
    confirmSwitchLine:'Mudar de linha vai reiniciar a sessão atual. Continuar?',
    about1:'Um trem futsū (普通) no Japão é um serviço local que para em todas as estações da linha.',
    about2:'Pomodoro é um método de gestão de tempo baseado em sessões de trabalho focado e pausas curtas.',
    about3:'Futsudoro é um temporizador pomodoro inspirado em trens para trabalho profundo, com modos Chronos (rígido) e Kairos (fluxo).',
    about4:'Feito com ❤️ + 🍀 por ishiroca + {anhdres}'
  },
  zh:{
    start:'开始', stop:'暂停', paused:'已暂停', next:'下一站', resume:'继续', reset:'重置',
    tabStats:'记录', tabTrip:'行程', tabSettings:'设置', tabAbout:'帮助',
    travelLog:'记录', stops:'停靠站', today:'今日', allTime:'累计', min:'分',
    tripConfig:'行程设置', work:'工作 (分)', break:'休息 (分)', longRest:'长休息 (分)',
    systemSettings:'系统设置', mode:'模式', notifications:'通知', theme:'主题', language:'语言',
    stationAnnouncements:'车站广播',
    notifOn:'开', notifOff:'关',
    light:'浅色', dark:'深色',
    tripDuration:'到终点站的行程时间: {duration}',
    exportLabel:'导出',
    confirmSwitchLine:'切换线路将重置当前会话。是否继续？',
    about1:'日本的普通列车（futsū・普通）是沿线每站都停的各站停车列车。',
    about2:'番茄工作法是基于专注工作与短暂休息交替的时间管理方法。',
    about3:'Futsudoro 是一款以火车旅行为灵感的番茄计时器，专为深度工作设计，提供 Chronos（严格）和 Kairos（心流）两种模式。',
    about4:'由 ishiroca + {anhdres} 用 ❤️ + 🍀 制作'
  }
};
