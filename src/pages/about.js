import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { renderSectionTitle } from '../components/SectionTitle.js';
import { bindNavbarToggle } from '../components/Navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('site-header').innerHTML = renderHeader();
  document.getElementById('site-footer').innerHTML = renderFooter();
  bindNavbarToggle(document);

  const titleContainer = document.getElementById('about-title');
  titleContainer.innerHTML = renderSectionTitle({
    eyebrow: 'Tentang',
    title: 'Business Law Community',
    subtitle: 'Ruang kolaborasi untuk memperkuat literasi hukum bisnis.',
  });
});
