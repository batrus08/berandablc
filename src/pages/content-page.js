import { setupPage } from '../utils/page.js';
import { loadJSON } from '../utils/helpers.js';
import { qs, setHTML } from '../utils/dom.js';

async function renderContentPage() {
  const key = document.body.dataset.page;
  const content = await loadJSON(new URL('../data/pages-content.json', import.meta.url).href);
  const page = content.find((item) => item.key === key);
  if (!page) return;
  document.title = `${page.title} | Business Law Community FH UGM`;
  renderHero(page);
  renderSections(page);
}

document.addEventListener('DOMContentLoaded', () => {
  setupPage(renderContentPage);
});

function renderHero(page) {
  setHTML(
    qs('#page-hero'),
    `
    <div class="container">
      <div class="page-hero__content">
        <p class="badge">${page.category}</p>
        <h1>${page.title}</h1>
        <p>${page.intro}</p>
      </div>
    </div>
  `
  );
}

function renderSections(page) {
  if (!page.sections?.length) return;
  const markup = page.sections
    .map(
      (section) => `
      <article class="section-block">
        <h3>${section.title}</h3>
        ${section.body ? `<p class="muted">${section.body}</p>` : ''}
        ${section.list ? `<ul>${section.list.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
      </article>
    `
    )
    .join('');
  setHTML(qs('#page-content'), `<div class="section-grid">${markup}</div>`);
}
