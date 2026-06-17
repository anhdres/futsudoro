# Futsudoro 🚃 + 🍅

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![Live](https://img.shields.io/badge/live-futsudoro.app-orange.svg)](https://futsudoro.app)
[![Made with ❤️ + 🍀](https://img.shields.io/badge/made_with-%E2%9D%A4%EF%B8%8F%20%2B%20%F0%9F%8D%80-ff69b4.svg)](#credits)

A train-inspired Pomodoro timer for deep work, with two timing modes:

- **Chronos** — strict Pomodoro (configurable work / break / long break).
- **Kairos** — flow-friendly, lets you ride past the preset into "overtime" and stop when you're done.

Twelve railway lines from Tokyo, Buenos Aires, Chiba, France, Germany, Italy, Austria, Sweden, Jujuy, China, India and Massachusetts, each with its own language for the station announcements. UI itself runs in 8 languages (JA / EN / ES / IT / DE / HI / FR / SV).

Static HTML + CSS + JS, no build step, no dependencies. Runs from any static host.

## Live

[futsudoro.app](https://futsudoro.app)

## Run locally

It's a static site. Either open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

That's it. No `npm install`, no bundler.

## Project layout

```
.
├── index.html          ← app shell (PWA, SEO, JSON-LD)
├── src/
│   ├── app.js          ← timer logic, line/station data, i18n
│   └── styles.css      ← sign panel + train indicator
├── manifest.webmanifest
├── icons/
├── about.html          ← English about page
├── about-{de,es,fr,hi,it,ja,zh}.html
├── LICENSE             ← AGPL-3.0
└── README.md
```

## How it works

- **Line picker** at the top: each line is a real railway line with real stations. The train indicator, the progress bar and the station strip all reflect where the timer is in its journey.
- **Chronos** mode: work / break / long break cycle, with an audible chime at each phase change.
- **Kairos** mode: the preset can be exceeded (overtime), the app waits for you to press "next" before moving on. Useful for flow states.
- **Multi-language**: line announcements use the language of the line (JP for Yamanote, ES for Urquiza, etc.); the UI strings use the selected UI language, both independent.
- **Routing**: clean URLs like `/yamanote/chronos` and `/lupiche/kairos` are deep links — shareable.
- **PWA**: installable on mobile, works offline after first load.

## License

Copyright (C) 2026 anhdres · ishiroca

This program is free software: you can redistribute it and/or modify it under the terms of the **GNU Affero General Public License** as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. See the [LICENSE](LICENSE) file for the full text.

In short: free to use, modify and fork. Any modified version that you make available to others over a network must also be released under AGPL-3.0 with source visible. No warranty.

## Contributing

Issues, ideas and pull requests welcome. Keep changes small and focused; open an issue first if you want to discuss a bigger redesign.

When you submit a PR, you agree to license your contribution under the same AGPL-3.0.

## Credits

Built with ❤️ + 🍀 by **ishiroca** + **anhdres**.

## Feedback

[feedback@futsudoro.app](mailto:feedback@futsudoro.app)
