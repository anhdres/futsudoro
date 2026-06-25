# Futsudoro

Train-inspired Pomodoro timer: a focused work session as a local train ride, station by station.

## Current status

Recovered from the live production site on **2026-05-10** (`https://www.futsudoro.app/`) after the local source went missing during the Syncthing/Drive incident.

The recovered production app is a small static web app:

- HTML/CSS/JS vanilla
- Web Audio API chimes
- `localStorage` stats/settings
- PWA manifest/icons
- Vercel deploy

## Project layout

```text
projects/Futsudoro/
├── web/                 # Clean recovered web source, normalized for editing
│   ├── index.html
│   ├── about*.html
│   ├── manifest.webmanifest
│   ├── icons/
│   └── src/
│       ├── styles.css
│       └── app.js
├── recovered-live/      # Raw snapshot pulled from production, keep as reference
├── assets/              # Original design/source assets that survived locally
├── references/          # Visual/reference material
├── futsudoro.md         # Project memory / product notes
└── futsudoro-ideas-checklist.md
```

## Flutter native app

A Flutter scaffold now lives in `flutter/`. It targets Android, iOS, macOS, web, and Windows from one codebase.

See `FLUTTER_SETUP.md` for installed versions, verification status, and native toolchain blockers.

## Local development

From this folder:

```bash
cd web
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

A local server is preferred over opening `index.html` directly because the app uses root-relative paths like `/src/app.js`, `/icons/icon.svg`, and `/manifest.webmanifest`.

## Next direction

The recovered web app is the source-of-truth for behavior and copy. For the native version, use it as a product/spec reference and rebuild in Flutter rather than wrapping it blindly in a WebView.
