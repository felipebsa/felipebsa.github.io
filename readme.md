# Felipe Barbosa | Personal Portfolio

[**felipebsa.github.io**](https://felipebsa.github.io)

My personal portfolio, built with plain HTML, CSS and JavaScript.

## About

A single page with my background, tech stack, projects, study repositories, work experience, academic awards and contact info.

## Features

- Top navbar that turns into a frosted bar on scroll, with a dropdown menu on mobile
- Light and dark theme, saved in `localStorage`
- Reveal animations on scroll and active section highlighted in the navbar (`IntersectionObserver`)
- Project grid with clickable stack tags linking to each technology's official site
- Tech stack split into 4 groups with icons and hover animation
- Study repositories section linking to GitHub
- Purple rain animation on the left side, drawn on `<canvas>` and fixed to the page (turns off on small screens and with reduced motion)
- Custom purple cursor and a soft light that follows the mouse
- Copy-to-clipboard button for the e-mail
- WebP images with JPEG fallback via `<picture>`
- Open Graph and Twitter Card tags for link previews
- Inline SVG icons, no icon libraries

## Tech Stack

- HTML5
- CSS3 (custom properties, no framework)
- Vanilla JavaScript (ES6+)
- Google Fonts: Space Grotesk, Fraunces, Inter and JetBrains Mono

## Project Structure

```
felipebsa.github.io/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    ├── hero-bg.jpg
    ├── profile.jpg / profile.webp
    ├── proj-nippon.jpg / .webp
    ├── proj-loctis.jpg / .webp
    ├── proj-cvvj.jpg / .webp
    ├── proj-contractsys.jpg / .webp
    ├── cursor.svg
    ├── cursor-pointer.svg
    ├── favicon.svg
    ├── og-image.jpg
    └── felipe-barbosa-curriculo.pdf
```

## Running locally

Just open `index.html` in the browser. If you want the page served like it is on GitHub Pages:

```bash
python -m http.server 8000
```

Then go to `http://localhost:8000`.

## Deployment

Hosted on **GitHub Pages**. Since the repository is named `felipebsa.github.io`, every push to `main` updates [felipebsa.github.io](https://felipebsa.github.io) automatically (Settings → Pages → deploy from `main`, root folder).

## Author

**Felipe Barbosa Santos**, Jundiaí, SP
Backend developer in training, Systems Development student at ETEC Vasco Antônio Venchiarutti

- GitHub: [github.com/felipebsa](https://github.com/felipebsa)
- LinkedIn: [felipebsa](https://linkedin.com/in/felipebsa)
- Instagram: [@felipe__bsa](https://www.instagram.com/felipe__bsa/)
