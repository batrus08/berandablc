export function renderServiceCard(service) {
  return `
    <article class="surface-card service-card" tabindex="0">
      <div class="service-icon" aria-hidden="true">${service.icon}</div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
      <a class="service-link" href="${service.href}">Selengkapnya »</a>
    </article>
  `;
}
