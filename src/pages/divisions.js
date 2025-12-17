import { mountLayout } from '../components/Layout.js';
import { loadJSON } from '../utils/helpers.js';
import { qs, setHTML } from '../utils/dom.js';

document.addEventListener('DOMContentLoaded', async () => {
  mountLayout();
  const divisions = await loadJSON('../data/divisions.json');
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
});
