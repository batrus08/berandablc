export function renderSectionTitle({ eyebrow, title, subtitle }) {
  return `
    <div class="section-header">
      <div>
        ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
        <h2 class="section-heading">${title}</h2>
        ${subtitle ? `<p class="section-subtitle section-description">${subtitle}</p>` : ''}
      </div>
    </div>
  `;
}
