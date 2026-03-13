# Voldermort Music Vault

## Current State
The app uses a dark purple OKLCH color scheme with gradient text, glass nav, vault-glow utilities, and framer-motion entrance animations. The logo and headings use a static `text-gradient` class. There are no pulsating/glow animations on text elements.

## Requested Changes (Diff)

### Add
- Neon electric aesthetic layered on top of the existing purple theme
- Neon accent colors: cyan and pink alongside the existing purple
- Pulsating glow keyframe animation (`neon-pulse`) for the logo icon, logo text, and section headings -- subtle breathing glow, not flickering
- Neon glow on category cards hover state
- Stronger neon glow on VideoCard hover
- Ambient neon scanline or grid overlay on the body background (very subtle)

### Modify
- `index.css`: add `@keyframes neon-pulse` with subtle box-shadow/text-shadow breathing; add `.neon-pulse` and `.neon-pulse-text` utility classes; update body background to include faint neon grid lines; update `--accent` to a vivid cyan; add neon color variables for pink and cyan
- `Navigation.tsx`: apply `neon-pulse` to the Music2 logo icon and `neon-pulse-text` to the logo text
- `HomePage.tsx`: apply `neon-pulse` to the hero Music2 icon and hero h1; apply `neon-pulse-text` to section headings ("Browse by Genre", "Featured Tracks")
- `CategoryPage.tsx` and other pages: apply `neon-pulse-text` to page headings
- `VideoCard.tsx`: enhance glow on hover with neon cyan tint

### Remove
- Nothing removed

## Implementation Plan
1. Update `index.css`: add neon keyframe animation, neon utility classes, neon CSS variables for cyan/pink, subtle background grid
2. Update `Navigation.tsx`: add neon-pulse to logo icon and text
3. Update `HomePage.tsx`: add neon-pulse to hero icon, h1, and section headings
4. Update `CategoryPage.tsx`, `SearchPage.tsx`, `ArtistPage.tsx`: add neon-pulse-text to page headings
5. Update `VideoCard.tsx`: strengthen neon glow on hover
6. Validate build
