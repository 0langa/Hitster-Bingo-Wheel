# Hitster Bingo Wheel

A polished, interactive category-selection wheel for the Hitster Music Bingo game.  
Built with **plain HTML, CSS, and JavaScript** — no build step, no frameworks.

## Features

- **Two game modes**: Anfänger (beginner) and Profi (advanced)
- **5 color-coded categories** per mode matching the physical wheel
- **Smooth spin animation** with randomized outcome and natural deceleration
- **Neon arcade visual style** recreated entirely in SVG + CSS (no image assets)
- **Responsive** — works on desktop, tablet, and mobile
- **Accessible** — keyboard-navigable, ARIA roles, live result announcements

## How to Run

No install needed. Just open `index.html` in any modern browser:

```
# Option A – double-click index.html in your file manager

# Option B – use a local server (avoids any CORS edge cases)
npx serve .
# or
python -m http.server
```

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch → main → / (root)**
4. Your site will be live at `https://<user>.github.io/Hitster-Bingo-Wheel/`

## Project Structure

```
index.html          – page shell with all DOM structure
css/
  style.css         – neon arcade theme, layout, responsive breakpoints
js/
  config.js         – category data for both modes, spin constants
  wheel.js          – SVG wheel renderer (segments, glow, branding)
  spin.js           – deterministic spin animation via CSS transitions
  app.js            – app controller (mode switch, spin, legend, result)
```

## How the Spin Works

1. A random target segment (0–4) is chosen
2. The final rotation angle is computed so the **pointer at 12 o'clock** lands on the center of that segment
3. Several full extra rotations are added for visual drama
4. A CSS `transition` with a `cubic-bezier(0.15, 0.6, 0.25, 1)` ease-out curve handles the smooth deceleration
5. After the transition ends, the winning category is displayed

## Configuration

All wheel data lives in `js/config.js`. To add a new mode or change categories, edit the `WHEEL_CONFIGS` object — the rest of the app picks it up automatically.
