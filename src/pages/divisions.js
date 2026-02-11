import { setupPage } from '../utils/page.js';
import { loadJSON } from '../utils/helpers.js';
import { qs, setHTML } from '../utils/dom.js';

async function renderDivisions() {
  const divisions = await loadJSON(new URL('../data/divisions.json', import.meta.url).href);
  const target = qs('#division-list');
  setHTML(
    target,
    divisions
      .map(
        (division) => `
        <article class="card" id="${division.id}">
          <div class="badge">${division.name}</div>
          <p class="muted">${division.description}</p>
          <h4>Program Kerja</h4>
          <ul>
            ${division.programs.map((p) => `<li>${p}</li>`).join('')}
          </ul>
        </article>
      `
      )
      .join('')
  );
}

document.addEventListener('DOMContentLoaded', () => {
  setupPage(renderDivisions);
});
