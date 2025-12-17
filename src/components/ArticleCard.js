import { formatDate } from '../utils/helpers.js';

export function renderArticleCard(item) {
  return `
    <article class="card">
      <div class="badge">${item.categoryType}</div>
      <h3 class="card__title"><a href="./articles.html?slug=${item.slug}">${item.title}</a></h3>
      <div class="card__meta">
        <span>${formatDate(item.date)}</span>
        <span>• ${item.author.name} (${item.author.affiliation})</span>
      </div>
      <p class="muted">${item.excerpt}</p>
      <div class="list-inline">${item.topics.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
    </article>
  `;
}
