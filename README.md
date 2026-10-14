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

## RocketRide integration (`integrated` branch)

The `integrated` branch adds the [RocketRide TypeScript SDK](https://docs.rocketride.org) and one pipeline-backed feature: the **✨ Assist** button in the editor. It sends the open note to a RocketRide pipeline that summarizes it in 3 to 5 bullets with Claude, and shows the bullets under the editor.

| File | What it does |
| --- | --- |
| `src/rocketride.ts` | Creates one shared, connected `RocketRideClient` |
| `src/assist.ts` | The Summarize pipeline and `runAssist()`, which the Assist button calls |
| `.env.example` | Copy to `.env.local` and add your RocketRide API key |

The pipeline reads the Anthropic key as `${ROCKETRIDE_ANTHROPIC_KEY}`, which RocketRide resolves on the server from your organization's **Variables**. Set it there; it never goes into the browser.

```sh
cp .env.example .env.local   # then set VITE_ROCKETRIDE_APIKEY
pnpm install && pnpm dev
```

Vite exposes `VITE_*` variables to the browser. That is fine for local development, but don't deploy a build with a real key in it.
