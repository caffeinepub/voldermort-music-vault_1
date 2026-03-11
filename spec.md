# Voldermort Music Vault

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full-stack music YouTube link vault app
- Backend: Motoko canister storing video entries (id, title, artist, category, youtubeUrl, thumbnailUrl, dateAdded)
- Seeded with 15-20 sample entries across various genres
- Public read queries: list all videos, search by keyword (title/artist/category), filter by category, filter by artist, get all categories, get all artists
- Admin CRUD: add, edit, delete video entries; manage categories and artists
- Internet Identity authentication gating admin access
- Frontend: dark moody theme (deep purples, blacks, accent colors)
- Home page: featured/recent videos grid + category navigation tiles
- Search bar: searches title, artist, category
- Browse by Category pages: grid of videos filtered by selected category
- Browse by Artist: filter/list by artist name
- Video card: YouTube thumbnail, title, artist, category badge — clicking opens YouTube in new tab
- Floating "Back to Top" button appears on scroll
- Navigation: always-visible Home button, search
- Admin panel (hidden from visitors): add/edit/delete videos, manage categories/artists
- Smooth hover animations and transitions on cards
- Grid layouts with proper spacing

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Select `authorization` Caffeine component
2. Generate Motoko backend with video CRUD, public queries, seed data, and admin-gated mutations
3. Build React frontend:
   - App shell with dark theme, navigation, back-to-top button
   - Home page with recent videos grid and category nav
   - Search results page
   - Category browse page
   - Artist browse page
   - Video card component with YouTube thumbnail and hover effects
   - Admin panel with II auth: add/edit/delete videos and categories
