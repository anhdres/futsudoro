# Futsudoro Recovery Log

## 2026-05-10

Recovered the live app from:

- `https://futsudoro.vercel.app` → redirects to `https://www.futsudoro.app/`
- `https://www.futsudoro.app/`

Note: `futsudoro.com` did not resolve from the Mac during recovery; the active domain is `futsudoro.app`.

## Retrieved files

Raw snapshot was stored in `recovered-live/` (removed 2026-07-21 — the
snapshot predates PA station announcements, robust timer, i18n en 10
idiomas, y 9-line casting. `web/` ahora es la source of truth; el git
history tiene todos los commits).

- `index.html` — 64 KB production app with inline CSS/JS
- localized about pages: `about.html`, `about-es.html`, `about-ja.html`, `about-zh.html`, `about-hi.html`, `about-de.html`, `about-fr.html`, `about-it.html`
- `manifest.webmanifest`
- icons: `icon.svg`, `icon-192.png`, `icon-512.png`

## Normalization

Created `web/` as editable source:

- Extracted inline CSS from `index.html` into `web/src/styles.css`
- Extracted main app JavaScript into `web/src/app.js`
- Kept SEO/redirect/schema JSON inline in `web/index.html`
- Copied localized about pages, manifest, and icons unchanged

## Known stack

Per existing notes and recovered source:

- Vanilla HTML/CSS/JS
- Web Audio API
- localStorage
- PWA manifest
- Vercel Analytics/Speed Insights scripts in production HTML

## Caveat

This is a recovery of the deployed production artifact, not necessarily the exact original repo history. It is good enough to resume development and to serve as the spec for a Flutter/native rebuild.
