# Warzone Mobile — Landing Page (Concept)

A fan-made concept landing page for a COD-Mobile-style game, built as a static site with vanilla HTML/CSS/JS — no frameworks, no build step.

> Not affiliated with Activision. This is a demo/portfolio project only.

## Preview

Open `index.html` directly in a browser, or serve it locally:

```bash
python -m http.server 8420 --directory .
```

Then visit `http://localhost:8420`.

## Features

- Responsive landing page: hero, feature grid, game modes, gallery, download CTA
- Animated hero banner: looping helicopter flight, dropping paratroopers, radar sweep, city skyline silhouette, drifting ember particles
- Glitch-style flicker text effect, pulsing CTA glow, animated gradient background
- Scroll-triggered fade-ins and count-up stat counters
- 3D cursor-tracking tilt on feature/mode cards

## Structure

```
index.html    Page markup
styles.css    Styling, layout, animations
script.js     Scroll effects, particle canvas, tilt, count-up logic
```

## Tech

Plain HTML5, CSS3 (custom properties, keyframe animations, `conic-gradient`), and vanilla JS (`IntersectionObserver`, `requestAnimationFrame`, Canvas 2D). No dependencies.
