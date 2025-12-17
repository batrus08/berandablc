import { mountLayout } from '../components/Layout.js';
import { loadJSON } from '../utils/helpers.js';
import { qs, setHTML } from '../utils/dom.js';

document.addEventListener('DOMContentLoaded', async () => {
  mountLayout();
  const data = await loadJSON('../data/gallery.json');
  renderPhotos(data.photos);
  renderVideos(data.videos);
  renderCoverage(data.coverage);
});

function renderPhotos(photos) {
  const target = qs('#photo-grid');
  setHTML(
    target,
    photos
      .map((p) => `<img src="${p.url}" alt="${p.title}" data-full="${p.url}" />`)
      .join('')
  );
  target.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      const lightbox = qs('#lightbox');
      setHTML(lightbox, `<img src="${e.target.dataset.full}" alt="${e.target.alt}" />`);
      lightbox.classList.remove('hidden');
      lightbox.addEventListener(
        'click',
        () => {
          lightbox.classList.add('hidden');
        },
        { once: true }
      );
    }
  });
}

function renderVideos(videos) {
  const target = qs('#video-grid');
  setHTML(
    target,
    videos
      .map(
        (vid) => `
        <article class="card">
          <h3>${vid.title}</h3>
          <div class="responsive-embed">
            <iframe src="${vid.embed}" title="${vid.title}" allowfullscreen></iframe>
          </div>
        </article>
      `
      )
      .join('')
  );
}

function renderCoverage(items) {
  const target = qs('#coverage');
  setHTML(
    target,
    items
      .map((item) => `<article class="card"><h3>${item.title}</h3><p class="muted">${item.source}</p><a class="btn secondary" href="${item.link}">Baca Liputan</a></article>`)
      .join('')
  );
}
