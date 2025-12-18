import { renderDropdownMenu } from './DropdownMenu.js';
import { qsa } from '../utils/dom.js';

const menuConfig = [
  { label: 'Beranda', href: './index.html' },
  {
    label: 'Tentang Kami',
    items: [
      { text: 'Sejarah Law Community FH', href: './about.html#sejarah' },
      { text: 'Visi & Misi', href: './about.html#visi-misi' },
      { text: 'Nilai dan Fokus Kajian', href: './about.html#nilai' },
      { text: 'Struktur Organisasi / Pengurus', href: './about.html#struktur' },
    ],
  },
  {
    label: 'Artikel',
    items: [
      { text: 'Artikel Bulanan', href: './articles.html?category=Artikel%20Bulanan' },
      { text: 'Opini & Esai Hukum', href: './articles.html?category=Opini%20%26%20Esai%20Hukum' },
      { text: 'Kajian Hukum', href: './articles.html?category=Kajian%20Hukum' },
      { text: 'Resensi Buku Hukum', href: './articles.html?category=Resensi%20Buku%20Hukum' },
      { text: 'Arsip Artikel', href: './articles.html#arsip' },
    ],
  },
  {
    label: 'Kegiatan',
    items: [
      { text: 'Seminar & Webinar', href: './events.html?type=Seminar%20&%20Webinar' },
      { text: 'Diskusi Hukum', href: './events.html?type=Diskusi%20Hukum' },
      { text: 'Pelatihan Legal Skill', href: './events.html?type=Pelatihan%20Legal%20Skill' },
      { text: 'Kompetisi / Call for Paper', href: './events.html?type=Kompetisi%20/%20Call%20for%20Paper' },
      { text: 'Program & Aktivitas Lainnya', href: './events.html?type=Program%20%26%20Aktivitas%20Lainnya' },
      { text: 'Dokumentasi Kegiatan', href: './events.html#dokumentasi' },
    ],
  },
  {
    label: 'Divisi',
    items: [
      { text: 'Divisi Riset & Penulisan', href: './divisions.html#rwp' },
      { text: 'Divisi Pendidikan & Pelatihan', href: './divisions.html#pendidikan' },
      { text: 'Divisi Bisnis & Kemitraan', href: './divisions.html#bisnis' },
      { text: 'Divisi Media & Publikasi', href: './divisions.html#media' },
    ],
  },
  { label: 'Kerja Sama', href: './partnership.html' },
  {
    label: 'Galeri',
    items: [
      { text: 'Foto Kegiatan', href: './gallery.html#foto' },
      { text: 'Video Kegiatan', href: './gallery.html#video' },
      { text: 'Media Coverage', href: './gallery.html#media' },
    ],
  },
  { label: 'Kontak', href: './contact.html' },
];

export function renderNavbar() {
  const navItems = menuConfig
    .map((menu) => {
      if (menu.items) {
        return renderDropdownMenu(menu.label, menu.items);
      }
      return `<li class="nav-item"><a class="nav-link" href="${menu.href}">${menu.label}</a></li>`;
    })
    .join('');

  return `
    <nav class="navbar" aria-label="Navigasi utama">
      <div class="container navbar__inner">
        <a class="brand" href="./index.html">
          <span class="brand__mark">LC</span>
          <span class="brand__text">
            <span>Law Community FH</span>
            <span class="brand__subtitle">Hukum Bisnis & Kemitraan</span>
          </span>
        </a>
        <button class="navbar__toggle" aria-expanded="false" aria-label="Toggle navigasi"><span></span></button>
        <div class="navbar__menu" role="menubar">
          <ul class="nav-list">
            ${navItems}
          </ul>
        </div>
      </div>
      <div class="navbar__backdrop" data-nav-backdrop></div>
    </nav>
  `;
}

export function bindNavigation(scope = document) {
  const triggers = qsa('[data-dropdown]', scope);
  const navbar = scope.querySelector('.navbar');
  const toggle = navbar?.querySelector('.navbar__toggle');
  const menu = navbar?.querySelector('.navbar__menu');
  const backdrop = navbar?.querySelector('[data-nav-backdrop]');
  const navLinks = qsa('.nav-link', navbar);
  const dropdownLinks = qsa('.dropdown__item', navbar);

  function closeAllDropdowns() {
    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.closest('.nav-item')?.classList.remove('expanded');
      const menuEl = trigger.nextElementSibling;
      if (menuEl) menuEl.classList.remove('open');
    });
  }

  function closeMenu() {
    if (toggle && menu) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      backdrop?.classList.remove('active');
      closeAllDropdowns();
    }
  }

  triggers.forEach((trigger) => {
    const menuEl = trigger.nextElementSibling;
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      const isMobile = window.matchMedia('(max-width: 960px)').matches;

      closeAllDropdowns();
      const willOpen = !isOpen;
      trigger.setAttribute('aria-expanded', String(willOpen));
      trigger.closest('.nav-item')?.classList.toggle('expanded', willOpen);
      if (!isMobile) {
        menuEl?.classList.toggle('open', willOpen);
      }
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        trigger.click();
      }
      if (event.key === 'Escape') {
        closeAllDropdowns();
        trigger.focus();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-item') && !event.target.closest('.navbar__toggle')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  toggle?.addEventListener('click', () => {
    if (!menu) return;
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('open', !isOpen);
    backdrop?.classList.toggle('active', !isOpen);
    if (!isOpen) {
      closeAllDropdowns();
    }
  });

  backdrop?.addEventListener('click', closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 960) closeMenu();
    });
  });

  dropdownLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 960) closeMenu();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      backdrop?.classList.remove('active');
      menu?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
}
