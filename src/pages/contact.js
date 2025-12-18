import { setupPage } from '../utils/page.js';
import { qs, setHTML } from '../utils/dom.js';

document.addEventListener('DOMContentLoaded', () => {
  setupPage(renderContact);
});

function renderContact() {
  const target = qs('#contact-root');
  setHTML(
    target,
    `
    <div class="section__header">
      <h1 class="section__title">Kontak</h1>
      <p class="section__subtitle">Hubungi sekretariat Law Community FH</p>
    </div>
    <div class="grid grid-2">
      <section class="card">
        <h3>Informasi Kontak</h3>
        <p>Secretariat: Jl. Progresif No.123, Kampus FH</p>
        <p>Email resmi: <a href="mailto:lawcommunity@fh.ac.id">lawcommunity@fh.ac.id</a></p>
        <p>Media sosial:
          <a href="https://instagram.com">Instagram</a> •
          <a href="https://linkedin.com">LinkedIn</a> •
          <a href="https://youtube.com">YouTube</a>
        </p>
      </section>
      <section class="card">
        <h3>Form Kontak</h3>
        <form action="https://formspree.io/f/moqgjwyj" method="POST" class="stacked-gaps">
          <label>Nama<br /><input name="name" required /></label>
          <label>Email<br /><input type="email" name="email" required /></label>
          <label>Pesan<br /><textarea name="message" rows="4" required></textarea></label>
          <button class="btn primary" type="submit">Kirim</button>
        </form>
      </section>
    </div>
    <section class="section">
      <h3>Peta Kampus</h3>
      <div class="responsive-embed">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31693.765642938112!2d106.8229!3d-6.2000"
          loading="lazy"
          allowfullscreen
        ></iframe>
      </div>
    </section>
  `
  );
}
