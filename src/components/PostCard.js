import { formatDate } from '../utils/helpers.js';

export function renderPostCard(item) {
  const category = item.category || 'Kegiatan';
  return `
    <article class="post-card" tabindex="0">
      <div class="post-meta">
        <span class="tag">${category}</span>
        <span class="meta-dot">${formatDate(item.date)}</span>
      </div>
      <h3 class="post-title">${item.title}</h3>
      <p>${item.excerpt}</p>
      <a class="read-more" href="${item.slug}">
        Baca selengkapnya
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </article>
  `;
}
