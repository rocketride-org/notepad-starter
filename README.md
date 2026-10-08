# notepad-starter

A tiny notepad: create, edit, delete and list notes, stored in your browser's `localStorage`. Vite and TypeScript, no framework.

This is the starting point for the `notepad-integration` module of the [RocketRide workshops](https://github.com/rocketride-org/rocketride-workshops). The `main` branch is the plain app. The `integrated` branch has a RocketRide pipeline wired in.

## Run it

Requires Node 20+ and pnpm 10+.

```sh
pnpm install && pnpm dev
```

Then open http://localhost:5173.

## Files

| File | What it does |
| --- | --- |
| `src/notes.ts` | The `Note` type and `localStorage` load/save |
| `src/main.ts` | Renders the list and the editor, handles create/edit/delete |
| `src/style.css` | Styles |
