# berandablc

Refactored static structure for the Beranda (homepage) of Business Law Community. The code is modular, data-driven, mobile-first, and ready for static hosting (GitHub Pages, Netlify) or embedding inside a WordPress site.

## Folder overview
- `src/assets/` – placeholders for images, icons, and fonts used across pages.
- `src/components/` – reusable UI components (header, footer, navbar, cards, section title).
- `src/pages/` – entry points (`index.html` and supporting pages) that assemble components and data.
- `src/styles/` – global, component-level, and page-specific styles (no inline CSS).
- `src/data/` – JSON sources for news, articles, events, divisions, gallery, etc. Content is decoupled from markup.
- `src/utils/` – helpers for DOM, data loading, i18n, and a shared page bootstrapper.

## Running locally
1. Serve the `src/` folder with any static server to avoid CORS issues when fetching JSON files. Example: `npx serve src` then open `http://localhost:3000/pages/index.html`.
2. All pages import ES modules directly—no build step is required.

## Mobile & responsiveness
- Navigation, topbar, and grids collapse automatically under 960px; additional spacing tweaks are applied below 720px.
- Hero sliders, cards, and embeds use fluid units (`clamp`, `minmax`) to stay legible on phones.
- Test quickly by resizing the browser or using devtools device emulation; no platform-specific code is required.

## Updating content (articles, news, events, gallery)
All public content is stored in JSON files under `src/data/`. Uploading new material only requires editing these files and dropping related assets into `src/assets/`.

- **Articles** (`src/data/articles.json`)
  - Fields: `slug`, `title`, `categoryType`, `topics` (array), `date` (`YYYY-MM-DD`), `excerpt`, `content`, optional `doi`, `issn`, `pdfUrl`, and `author` object (`name`, `affiliation`).
  - After adding an item, it appears in `articles.html`; detail pages use the `slug` query parameter.
- **News** (`src/data/news.json`)
  - Fields: `slug`, `title`, `category`, `date`, `excerpt`, `image`, `link` (external) or `content` for internal rendering.
  - Latest news are merged with articles on the homepage.
- **Events** (`src/data/events.json`)
  - Fields: `slug`, `title`, `type`, `taxonomy`, `dateStart`, optional `dateEnd`, `location`, `poster`, `excerpt`, `description`, optional `minutesPdf`/`reportPdf`.
  - Filters on `events.html` are driven by `type` and `taxonomy` values.
- **Gallery** (`src/data/gallery.json`)
  - Contains `photos`, `videos`, and `coverage` arrays. Each photo item has `title` and `url`; videos use an embeddable URL in `embed`; coverage links use `title`, `source`, and `link`.

### Upload workflow
1. Place new media (images, PDFs) in `src/assets/` and reference them with relative paths in the JSON files.
2. Edit the relevant JSON entry to include metadata (title, dates, taxonomy, etc.).
3. Run a static server (`npx serve src`) and open the corresponding page to confirm rendering.
4. Commit and deploy the updated `src/` folder to your static host or WordPress (see below).

## Using inside WordPress
The site stays framework-free, so it can be dropped into WordPress without a build step:

- **Static embed on a page/post**
  1. Upload the `src/` folder to `/wp-content/uploads/berandablc/` or a custom plugin directory.
  2. Create a WordPress page and add a *Custom HTML* block with an `<iframe>` pointing to `/wp-content/uploads/berandablc/pages/index.html` (or another page). Set the iframe to `width="100%"` and `height="100vh"` for a full view.

- **Theme or child-theme include**
  1. Copy the `src/` folder into your theme (e.g., `/wp-content/themes/your-theme/berandablc/`).
  2. Add a template that echoes the desired HTML file via `readfile` or `include`, and enqueue the CSS files (`styles/*.css`).

- **Dynamic content from WordPress**
  - If you want WordPress to own the content, expose posts via the WP REST API and update `loadJSON` calls in `src/utils/helpers.js` (or the individual page scripts) to point to those endpoints instead of local JSON files.
  - Keep JSON shapes identical to the fields listed above so the existing renderers continue to work.

## Internationalization
- Language files live in `src/i18n/`. The helper `setupPage` ensures translations load before rendering and re-render when the language switcher is used.
- Add new keys to both `id.json` and `en.json` to keep the navbar, hero, and section labels in sync.
