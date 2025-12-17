# berandablc

Refactored static structure for the Beranda (homepage) of Business Law Community. The code is modular, data-driven, and ready for static hosting such as GitHub Pages.

## Folder overview
- `src/assets/` – placeholders for images, icons, and fonts used across pages.
- `src/components/` – reusable UI components (header, footer, navbar, cards, section title) shared by every page.
- `src/pages/` – page-level entry points (`index.html` as Beranda plus news, articles, about) that pull data and assemble components.
- `src/styles/` – global, component-level, and page-specific styles with no inline CSS.
- `src/data/` – JSON sources for news and articles so content stays decoupled from markup.
- `src/utils/` – shared utilities (data loading, merging, helpers for rendering focus categories).

## Running locally
Open `src/pages/index.html` in a static server (for example `npx serve src`) to avoid browser CORS limits when fetching JSON files. No backend or build step is required.
