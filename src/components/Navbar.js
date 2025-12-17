import { renderDropdownMenu } from './DropdownMenu.js';
import { qsa } from '../utils/dom.js';

export function renderNavbar() {
  const menus = [
    {
      label: 'Tentang Kami',
      items: [
        { text: 'Profil BLC', href: '#tentang' },
        { text: 'Struktur Organisasi', href: '#organisasi' },
        { text: 'Kemitraan', href: '#kemitraan' },
      ],
    },
    {
      label: 'Program & Kegiatan',
      items: [
        { text: 'Klinik Hukum', href: '#klinik' },
        { text: 'Pelatihan', href: '#pelatihan' },
        { text: 'Workshop & Seminar', href: '#seminar' },
      ],
    },
    {
      label: 'Media & Informasi',
      items: [
        { text: 'Berita', href: '#berita' },
        { text: 'Publikasi', href: '#publikasi' },
        { text: 'Insight', href: '#insight' },
      ],
    },
    {
      label: 'Keanggotaan',
      items: [
        { text: 'Daftar Anggota', href: '#anggota' },
        { text: 'Keuntungan', href: '#benefit' },
        { text: 'FAQ', href: '#faq' },
      ],
    },
  ];

  const navItems = menus.map((menu) => renderDropdownMenu(menu.label, menu.items)).join('');

  return `
    <nav class="navbar" aria-label="Navigasi utama">
      <div class="container navbar__inner">
        <a class="brand" href="./index.html">
          <span class="brand__mark">B</span>
          <span class="brand__text">
            <span>Business Law Community</span>
            <span class="brand__subtitle">Kolaborasi Hukum Bisnis</span>
          </span>
        </a>
        <div class="navbar__menu" role="menubar">
          <ul class="nav-list">
            ${navItems}
            <li class="nav-item">
              <a class="nav-trigger" href="#kontak">Kontak</a>
            </li>
          </ul>
          <div class="navbar__actions">
            <button class="icon-btn" aria-label="Cari">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2" fill="none"></circle>
                <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;
}

export function bindDropdowns(scope = document) {
  const triggers = qsa('[data-dropdown]', scope);

  function closeAll() {
    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false');
      const menu = trigger.nextElementSibling;
      if (menu) menu.classList.remove('open');
    });
  }

  triggers.forEach((trigger) => {
    const menu = trigger.nextElementSibling;
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      closeAll();
      trigger.setAttribute('aria-expanded', String(!isOpen));
      menu?.classList.toggle('open', !isOpen);
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        trigger.click();
      }
      if (event.key === 'Escape') {
        closeAll();
        trigger.focus();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-item')) {
      closeAll();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });
}
