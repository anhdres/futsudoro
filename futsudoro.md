# 🚂 Futsudoro — Pomodoro con estética de trenes japoneses

**Status:** Live ✅  
**URL:** [futsudoro.vercel.app](https://futsudoro.vercel.app)  
**Repo:** [anhdres/futsudoro](https://github.com/anhdres/futsudoro)  
**Vercel:** `andres-projects-615bc726/futsudoro`  
**Código local:** `~/.openclaw/workspace/projects/Futsudoro/`

**Relacionado:** [[Viajes/Japon]] — las líneas de tren reales日本的 inspiran el proyecto

---

## Idea general
Timer de productividad ambientado como viaje en tren.
No es “un pomodoro con skin”, sino una mini narrativa: estación → viaje → llegada.

**Lógica de viaje:**
- Sesión de trabajo = viaje en tren (20 min default)
- Break corto = espera en andén (5 min)
- Break largo (cada 4 viajes) = cambio de línea (25 min)

---

## Scope actual

### ✅ UI/UX
- Selector de 3 líneas (dropdown)
- Indicador de tren con animación
- Tren con 4 ruedas (ajuste visual)
- Bloque de status estable en mobile/desktop
- Línea kanji de estado: `停車中` / `運行中`
- Estado principal dinámico con estación:
  - `Stopped at <Station> Station`
  - `In Transit - Next station: <Station>`
- Reloj dividido: digital + analógico minimalista
- Track de estaciones con progreso visual
- Controles: 発車 (Start), 停車 (Pause), 終点 (Reset)
- Dark mode
- Panel de stats/trip/settings

### ✅ Datos
- **12 líneas reales** (actualizado 2026-03-25):
  - **Yamanote** 🇯🇵 (verde): Shinjuku → Shibuya → Harajuku → Tokyo → Akihabara → Ueno
  - **Nagareyama** 🇯🇵 (rojo): Mabashi → Kōya → Koen → Heiwadai → Nagareyama → Nagareyama-Central Park
  - **Urquiza** 🇦🇷 (amarillo): Federico Lacroze → Arata → Antonio Devoto → Coronel F. Lynch → Tropezón → Martín Coronado
  - **TER** 🇫🇷 (azul): Paris Austerlitz → Juvisy → Étampes → Les Aubrais → Mer → Blois Chambord
  - **Schwarzwaldbahn** 🇩🇪 (rojo DB): Freiburg → Offenburg → Hausach → Freudenstadt → Horb → Tübingen
  - **Regionale** 🇮🇹 (rojo Italia): Como S. Giovanni → Milano Centrale → Brescia → Verona Porta Nuova → Padova → Venezia S. Lucia
  - **Donau** 🇦🇹 (rojo): Wien FJB → Heiligenstadt → Klosterneuburg-Weidling → Tulln → Absdorf-Hippersdorf → Krems
  - **Södra** 🇸🇪 (negro): Stockholm → Norrköping → Linköping → Nässjö → Lund → Malmö
  - **Quebrada** 🇦🇷 (solar): Volcán → Tumbaya → Purmamarca → Posta de Hornillos → Maimará → Tilcara
  - **Lupiche** 🇨🇳 (verde China): 北京站 → 天津站 → 唐山站 → 秦皇岛站 → 山海关站 → 沈阳北站
  - **Konkan** 🇮🇳 (naranja): Roha → Ratnagiri → Kudal → Madgaon → Karwar → Udupi
  - **Commuter** 🇺🇸 (Massachusetts): North Station → Lynn → Salem → Beverly → Ipswich → Newburyport
- Nombres bilingües `{jp, en}`
- Layout robusto con nombres largos

### ✅ Audio
- Chimes con Web Audio API
  - Start: 523→659→784 Hz
  - Arrival: 784→659→523→440 Hz
  - Long rest: melodía extendida
  - End: escala completa

### ✅ Funcionalidad
- Cuenta regresiva
- Progreso visual por estaciones
- Persistencia en localStorage
- Notificaciones del sistema (opcional)
- Configuración de work/rest/journeys/long rest

---

## Qué funcionó bien
- La narrativa “viaje” suma motivación (no se siente timer genérico)
- El doble nivel de estado (kanji + texto claro) mejora comprensión
- El track visual con estaciones reales da personalidad fuerte
- El reloj dual (digital + analógico) elevó percepción de producto
- Iterar deploy por deploy en Vercel permitió afinar UX rápido

## Qué no funcionó / problemas que aparecieron
- Hubo colisión CSS entre `.station` del status y `.station` del track
- El bloque status fue frágil en responsive al principio
- Algunos títulos/etiquetas metían ruido en jerarquía visual

## Soluciones aplicadas
- Renombre de clases conflictivas: `status-station` / `status-transit`
- Refactor del bloque de status para estabilidad mobile/desktop
- Simplificación de jerarquía (menos ruido, más estado útil)

---

## Changelog resumido

**2026-03-15**
- Refactor completo de status
- Eliminado título “Status”
- Estado en 2 niveles (kanji + EN dinámico)
- Fix de colisión CSS de clases
- Deploy iterativo hasta validación visual final

**2026-03-14**
- Renombrado de `train-time` a `futsudoro`
- Estaciones reales en 3 líneas
- Ajustes de layout + reloj analógico
- Corrección visual del tren (4 ruedas)
- Deploy a producción

---

## Tech stack
- HTML/CSS/JS vanilla
- Web Audio API
- localStorage
- Vercel

---

## TODO futuro
- [ ] Campanas reales de estación (Eki-melo)
- [ ] Animación de tren entre estaciones
- [ ] Más líneas (Chuo, Sobu, etc.)
- [ ] Modo express (pomodoros largos)
- [ ] Stats semanales/mensuales
- [ ] Export/import de datos

---

## Operativa Vercel ↔ local (acordada)
Para este proyecto también aplica el flujo:
1. Código actualizado localmente
2. Deploy en Vercel
3. Bitácora local actualizada (cambios, qué funcionó, qué no)
4. Si hay decisiones duraderas, subir a `memory/YYYY-MM-DD.md` y/o `MEMORY.md`

## Flutter UX notes — 2026-05-11
- Keep: changing train line changes the accent of the whole app. This feels right; each route should tint the app identity, not only the route/progress marker.
- Recover from web: route progress should feel like a real subway/train map — thick line + station circles — not a generic progress bar.
- Keep from Flutter MVP: sliders for time/trip configuration.
- Visual parity pass from screenshot: white rounded device card on black background, heavy black section dividers, Yamanote header with dropdown + pixel train, red status strip, oversized 25:00 timer with analog clock, subway-map route line with circles, split Start/Reset controls, segmented bottom tabs.
