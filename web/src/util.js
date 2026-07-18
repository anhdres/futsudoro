// Pure helpers: formatting, normalization, route building, station lookup.
// No state, no side effects. All routing helpers take line/mode as arguments
// so this module stays free of cross-module state dependencies.
import { LINES, UI_STRINGS } from './data.js';

export function t(key, uiLocale){
  const dict = (uiLocale && UI_STRINGS[uiLocale]) || UI_STRINGS.ja;
  return dict[key] || UI_STRINGS.ja[key] || key;
}

export function normalizeLineKey(raw){
  if(!raw) return 'yamanote';
  const key = String(raw).toLowerCase();
  if(LINES[key]) return key;
  const decoded = decodeURIComponent(String(raw));
  if(LINES[decoded]) return decoded;
  // Fallback defensivo: slug desconocido no debe forzar línea China.
  // Mantener yamanote (default) es más predecible que cambiar silenciosamente.
  return 'yamanote';
}

const ROUTE_SLUGS = {
  yamanote: 'yamanote',
  urquiza: 'urquiza',
  nagareyama: 'nagareyama',
  ter: 'ter',
  schwarzwaldbahn: 'schwarzwaldbahn',
  regionale: 'regionale',
  donau: 'donau',
  sodra: 'sodra',
  quebrada: 'quebrada',
  lupiche: 'lupiche',
  konkan: 'konkan',
  commuter: 'commuter'
};

export function routeSlugFor(line){
  const safe = normalizeLineKey(line);
  return ROUTE_SLUGS[safe] || 'yamanote';
}

export function buildRoutePath(line, mode){
  return `/${encodeURIComponent(routeSlugFor(line))}/${mode}`;
}

export function syncRoute(line, mode){
  const next = buildRoutePath(line, mode);
  if(window.location.pathname !== next){
    window.history.replaceState({}, '', next);
  }
}

// Helpers for looking up stations/status for a given line. The caller passes
// the line key explicitly so this module does not need to import timer state.
export function getStationsFor(lineKey){
  const safe = normalizeLineKey(lineKey);
  return (LINES[safe] && LINES[safe].stations) || [];
}

export function stationLabelFor(lineKey, i){
  const stations = getStationsFor(lineKey);
  const idx = Math.max(0, Math.min(i, stations.length - 1));
  return stations[idx].jp;
}

export function fmtTpl(tpl, station){
  return (tpl || '').replace('{station}', station);
}

export function getStatusCopyFor(lineKey, currentJourney, isTransit){
  const safe = normalizeLineKey(lineKey);
  const status = (LINES[safe] && LINES[safe].status) || {};
  const station = isTransit
    ? stationLabelFor(safe, currentJourney + 1)
    : stationLabelFor(safe, currentJourney);
  if(isTransit){
    return {
      top: status.topTransit || 'In Transit',
      main: fmtTpl(status.transit || 'In Transit - Next station: {station}', station)
    };
  }
  return {
    top: status.topStopped || 'Stopped',
    main: fmtTpl(status.stopped || 'Stopped at {station} Station', station)
  };
}

// Time formatting
export function fmt(s){
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
}

export function fmtOvertime(s){
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return '+' + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
}

export function fmtDuration(mins){
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if(h > 0 && m > 0) return `${h}h ${m}m`;
  if(h > 0) return `${h}h`;
  return `${m}m`;
}

// Progress helpers take state explicitly so util.js stays decoupled.
export function workProg(cfg, timeLeft){
  return (cfg.work * 60 - timeLeft) / (cfg.work * 60);
}

export function totalProg(cfg, timeLeft, currentJourney){
  return Math.min(1, (currentJourney + workProg(cfg, timeLeft)) / cfg.journeys);
}
