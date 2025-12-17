export function renderTopbar() {
  const socials = [
    { name: 'Facebook', href: '#', label: 'Facebook' },
    { name: 'X', href: '#', label: 'X' },
    { name: 'Instagram', href: '#', label: 'Instagram' },
    { name: 'LinkedIn', href: '#', label: 'LinkedIn' },
    { name: 'YouTube', href: '#', label: 'YouTube' },
  ];

  const socialLinks = socials
    .map(
      (item) => `
        <a class="social-link" href="${item.href}" aria-label="${item.label}">
          ${item.name[0]}
        </a>
      `
    )
    .join('');

  return `
    <div class="topbar" aria-label="Follow us">
      <div class="container topbar__inner">
        <div class="topbar__label">Follow us</div>
        <div class="topbar__social" aria-label="Social media">
          ${socialLinks}
        </div>
      </div>
    </div>
  `;
}
