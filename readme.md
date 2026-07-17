# Felipe Barbosa — Personal Portfolio

Personal portfolio site built with plain HTML, CSS and JavaScript — no frameworks, no build step, no backend.

🔗 Live: _add link after deploying_

## About

Single-page portfolio presenting my background, tech stack, projects, work experience, academic awards and contact info. Built to be fast, dependency-free, and easy to host anywhere static files are served.

## Features

- Responsive layout: fixed sidebar navigation on desktop, off-canvas menu on mobile
- Light/dark theme toggle, preference persisted via `localStorage`
- Scroll-triggered reveal animations (`IntersectionObserver`)
- Project carousel with prev/next controls, dot indicators and touch swipe support
- WebP images with JPEG fallback via `<picture>`
- Open Graph / Twitter Card meta tags for link previews
- SVG favicon, no external icon libraries

## Tech Stack

- HTML5
- CSS3 (custom properties / design tokens, no framework)
- Vanilla JavaScript (ES6+)
- Google Fonts — Space Grotesk, Fraunces, Inter, JetBrains Mono

## Project Structure

```
site/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    ├── profile.jpg / profile.webp
    ├── hero-bg.jpg
    ├── proj-nippon.jpg / .webp
    ├── proj-cvvj.jpg / .webp
    ├── proj-contractsys.jpg / .webp
    ├── favicon.svg
    └── felipe-barbosa-curriculo.pdf
```

## Running locally

No dependencies, no build step — just open `index.html` in a browser.

## Deployment

Deployed via **GitHub Pages**:

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Deploy from the `main` branch, root folder
4. Site goes live at `https://<username>.github.io/<repo-name>`

## Author

**Felipe Barbosa Santos** — Jundiaí, SP
Backend developer in training · Systems Development student

- GitHub: [github.com/felipebsa](https://github.com/felipebsa)
- LinkedIn: [felipe-barbosa-santos](https://linkedin.com/in/felipe-barbosa-santos-b402a33a8)
- Instagram: [@felipe__bsa](https://www.instagram.com/felipe__bsa/)