# bibletype

A [Monkeytype](https://monkeytype.com)-style typing trainer for scripture. Each test
is a passage of consecutive King James Version verses — type it with live
per-character highlighting, a moving caret, and a clean WPM / accuracy results screen.

**[Live site →](https://timjonez.github.io/bibletype/)** · [Deployment runs](https://github.com/timjonez/bibletype/actions/workflows/deploy.yml)

The reference is hidden while you type and revealed on the results screen, so it
doubles as a memorization aid.

## Features

- **Verse passages** — type 1–8 consecutive verses, random or from a chosen book/chapter.
- **Live typing engine** — per-character correct/incorrect highlighting, blinking caret,
  backspace and Ctrl/Alt+word-delete, timer starting on the first keystroke.
- **Results** — WPM, raw WPM, accuracy, time, character counts, plus the revealed reference.
- **Stats history** — results persist in `localStorage` with a best-WPM tracker.
- **Light / dark themes** — dark by default, persisted.
- `Tab` starts a new passage, just like Monkeytype's restart shortcut.

## Tech

React + TypeScript + Vite. The full KJV text (public domain, 31,100 verses) is bundled
as `public/kjv.json` and fetched at runtime, so the app works fully offline.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
```

## Bible data

`public/kjv.json` is generated from a public-domain KJV source by
`scripts/build-kjv.mjs`, which normalizes the raw text: it keeps translator-supplied
(italic) words but strips marginal notes, cross-references, and epistle subscriptions.

```bash
node scripts/build-kjv.mjs /path/to/raw-kjv.json
```
