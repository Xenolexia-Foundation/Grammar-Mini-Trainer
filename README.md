# Grammar Mini-Trainer

A small **offline** app that drills grammar concepts: verb conjugation, gender/article, pluralization, and case endings. No backend, no content licensing issues—just local JSON rules and instant feedback.

## Features

- **Drill types:** Verb conjugation (EN/ES), gender & article (German), pluralization (German), case endings (German definite).
- **Instant feedback** after each answer, with “Next” for another question.
- **Streaks & stats:** Consecutive-day streak and per-session correct/total, stored locally.
- **Spaced repetition:** Items you got wrong or haven’t seen lately are favoured when picking the next question.
- **Difficulty levels:** Optional 1–3 tags on rule items; filter by level in the UI.
- **Export / import:** Backup or restore all stats and progress as JSON.
- **Theme:** Light/dark mode with system preference support.
- **Runs in the browser or as an Electron desktop app.**

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173).

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (browser) |
| `npm run build` | TypeScript check + production build → `dist/` |
| `npm run preview` | Serve production build locally |
| `npm run electron:dev` | Run as Electron app (dev: loads Vite server + DevTools) |
| `npm run electron:build` | Build web app then create desktop installers in `release/` |
| `npm run lint` | Run ESLint |

## Electron desktop app

- **Development:** `npm run electron:dev` starts the Vite server and opens an Electron window pointing at it.
- **Production:** `npm run electron:build` builds the site and then runs `electron-builder`. Installers (dmg/zip on macOS, nsis/portable on Windows, AppImage/deb on Linux) are written to `release/`.

Main process entry is `electron/main.cjs`; it loads either the dev URL or `dist/index.html` when not in dev.

## Project structure

```
├── public/
│   ├── rules/              # Rule JSON (verb-conjugation/, gender-article/, etc.)
│   └── manifest.webmanifest
├── src/
│   ├── engine/             # Rules loading, exercise generation, answer checking, registry
│   ├── storage/            # Streak, session, history, SRS, export/import
│   ├── ui/                 # React components (ConceptSelect, QuestionView, StatsBar, etc.)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── electron/
│   └── main.cjs            # Electron main process
├── data/rules/             # Docs for rule data (actual files live in public/rules/)
├── index.html
├── vite.config.ts
└── package.json
```

## Adding new drills

1. Add a JSON rule file under `public/rules/<concept-type>/` (e.g. `public/rules/pluralization/english.json`).
2. Use the schema for that concept (see `src/engine/types.ts`). Items can include optional `difficulty` (1–3).
3. Register the drill in `src/engine/registry.ts`: add an entry to `CONCEPT_OPTIONS` with `id`, `label`, `rulePath`, and `conceptType`.

Details and concept types are documented in `data/rules/README.md`.

## Tech stack

- **UI:** React 18, Vite 6, TypeScript
- **Storage:** `localStorage` (streaks, session, history, SRS, theme)
- **Desktop:** Electron 33, electron-builder

## License

Private / unlicensed unless you add one.
