# abhinavbachu.me

Personal site for [abhinavbachu.me](https://abhinavbachu.me) — a guided tour of my open-source projects, my startup (Veracare), and my research work.

## Stack

- Vite + React 18 + TypeScript
- Tailwind v4 (`@tailwindcss/vite`)
- React Router (BrowserRouter + `public/404.html` SPA shim for GitHub Pages)
- Framer Motion (selective use)
- Recharts
- Lucide icons
- Newsreader (display serif) + Inter (UI) + JetBrains Mono (code)

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to ./dist
npm run preview  # preview the production build
```

## Deployment

Pushes to `main` deploy automatically to GitHub Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

### First-time setup

1. Create a new public GitHub repo (suggested name: `abhinavbachu-me`).
2. Push this directory to it as `main`.
3. In GitHub → **Settings → Pages**, set "Build and deployment" → **Source: GitHub Actions**.
4. First push triggers the workflow; deploy takes ~1 min.

### DNS (one-time)

Point `abhinavbachu.me` at GitHub Pages at your registrar:

| Type  | Name | Value                                                                              |
| ----- | ---- | ---------------------------------------------------------------------------------- |
| A     | @    | 185.199.108.153                                                                    |
| A     | @    | 185.199.109.153                                                                    |
| A     | @    | 185.199.110.153                                                                    |
| A     | @    | 185.199.111.153                                                                    |
| AAAA  | @    | 2606:50c0:8000::153                                                                |
| AAAA  | @    | 2606:50c0:8001::153                                                                |
| AAAA  | @    | 2606:50c0:8002::153                                                                |
| AAAA  | @    | 2606:50c0:8003::153                                                                |
| CNAME | www  | `<github-username>`.github.io                                                      |

`public/CNAME` already contains `abhinavbachu.me`.

Then in GitHub: **Settings → Pages → Custom domain** → `abhinavbachu.me` → wait a few minutes for DNS check → enable **Enforce HTTPS**.

## Adding content

- **Talk video** — drop the file in `public/assets/talks/izfc/talk.mp4` (or host externally) and set `videoSrc` in [src/pages/talks/Izfc2025.tsx](src/pages/talks/Izfc2025.tsx). Files over ~80 MB should go on Cloudflare R2 / Bunny — GitHub Pages soft-caps large blobs and does not serve git-LFS over Pages.
- **Neurotech demo** — when ready, replace `<ComingSoon />` in [src/pages/projects/Neurotech.tsx](src/pages/projects/Neurotech.tsx) with the real interactive viewer.
- **New project** — add an entry to [src/data/projects.ts](src/data/projects.ts), create a new page in `src/pages/projects/`, and register the route in [src/App.tsx](src/App.tsx).

## Layout

```
public/         CNAME, 404.html SPA shim, og.png, favicon, project asset bundles
src/
  styles/       theme.css — forest-green Veracare-derived design system
  components/
    layout/     Nav, Footer, PageShell
    demo/      ScenarioPicker, RunButton, FakeProgress, NarrationRail, DemoFrame
  pages/        Home + projects/* + talks/*
  data/         projects + talks manifests
```
