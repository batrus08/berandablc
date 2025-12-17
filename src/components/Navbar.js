export function renderNavbar() {
  return `
    <nav class="navbar" aria-label="Navigasi utama">
      <a class="navbar__brand" href="./index.html">BLC</a>
      <button class="navbar__toggle" aria-expanded="false" aria-controls="primary-menu">Menu</button>
      <ul id="primary-menu" class="navbar__links">
        <li><a href="./index.html">Beranda</a></li>
        <li><a href="./news.html">News</a></li>
        <li><a href="./articles.html">Artikel</a></li>
        <li><a href="./about.html">Tentang</a></li>
      </ul>
    </nav>
  `;
}

export function bindNavbarToggle(container = document) {
  const toggle = container.querySelector('.navbar__toggle');
  const menu = container.querySelector('#primary-menu');

  if (menu) {
    highlightActiveLink(menu);
  }

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    menu.classList.toggle('is-open');
  });
}

function highlightActiveLink(menu) {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const links = menu.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href.endsWith(current)) {
      link.classList.add('is-active');
    }
  });
}
