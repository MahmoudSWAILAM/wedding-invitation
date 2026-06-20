# Reem & Malek — Wedding Invitation 🌙

A single-page wedding invitation site with a live countdown, built with plain HTML/CSS/JS — no build step, so it's ready to publish on GitHub Pages as-is.

## Files

```
index.html   → page structure & content
style.css    → all styling (night-corniche theme, gold accents, crescent-moon motif)
script.js    → countdown timer + scroll-reveal animations
```

## How to publish on GitHub Pages

1. Create a new repository on GitHub (e.g. `reem-and-malek-wedding`).
2. Upload `index.html`, `style.css`, and `script.js` to the root of the repo (drag-and-drop on GitHub's "Add file → Upload files" works fine).
3. Go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to **Deploy from a branch**.
5. Set **Branch** to `main` (or `master`) and folder to `/ (root)`, then **Save**.
6. Wait a minute, then your site will be live at:
   `https://<your-username>.github.io/<repo-name>/`

## Editing the content

- **Names / date / venue / time** — edit the text directly inside `index.html`.
- **Countdown target** — open `script.js` and change the line:
  ```js
  var WEDDING_DATE = new Date("2026-06-30T20:00:00+03:00").getTime();
  ```
  The `+03:00` is Cairo's time zone offset — keep it unless the hall is elsewhere.
- **Map link** — search for `https://maps.app.goo.gl/...` in `index.html` (it appears twice: the pin icon and the "Get Directions" button) and swap in a new link if needed.
- **Colors** — all colors are CSS variables at the top of `style.css` under `:root`. Change `--gold`, `--night-deep`, etc. to retheme the whole site.

## Notes

- The countdown counts down once and stops — it does not loop or reset after the wedding moment passes; it instead reveals a closing message.
- Motion respects `prefers-reduced-motion` for visitors who've disabled animations.
- No external image assets are used (everything is built with CSS gradients + inline SVG), so the site loads fast and has zero broken-image risk. If you'd like to add real photos (couple portrait, venue photo), drop them into an `assets/` folder and reference them in `index.html` — happy to wire that up.
