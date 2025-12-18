import { setupPage } from '../utils/page.js';
import { loadJSON } from '../utils/helpers.js';
import { qs, setHTML } from '../utils/dom.js';
import { renderPDFViewer } from '../components/PDFViewer.js';

async function renderPartnership() {
  const data = await loadJSON('../data/partners.json');
  const target = qs('#partnership-root');
  setHTML(
    target,
    `
    <div class="section__header">
      <h1 class="section__title">Kerja Sama & Bisnis</h1>
      <p class="section__subtitle">Identitas Law Community FH sebagai komunitas hukum bisnis</p>
    </div>
    <section class="card">
      <h3>Mitra & Sponsor</h3>
      <div class="grid grid-4">${[...data.mitra, ...data.sponsor]
        .map((m) => `<div class="card centered-card"><img src="${m.logo}" alt="${m.name}" /><p>${m.name}</p></div>`)
        .join('')}</div>
    </section>
    <section class="card">
      <h3>Program Kerja Sama</h3>
      <ul>
        <li>Joint research dan publikasi hukum bisnis.</li>
        <li>Program sponsorship untuk seminar dan kompetisi.</li>
        <li>Kolaborasi klinik hukum bisnis bagi startup.</li>
      </ul>
    </section>
    <section class="card">
      <h3>Layanan Legal Consulting</h3>
      <p class="muted">Tersedia berdasarkan permintaan mitra (placeholder untuk paket layanan).</p>
    </section>
    <section class="card">
      <h3>Media Partner</h3>
      <div class="grid grid-4">${data.media
        .map((m) => `<div class="card centered-card"><img src="${m.logo}" alt="${m.name}" /><p>${m.name}</p></div>`)
        .join('')}</div>
    </section>
    <section class="card">
      <h3>Proposal Kerja Sama</h3>
      ${renderPDFViewer(data.proposalPdf)}
    </section>
  `
  );
}

document.addEventListener('DOMContentLoaded', () => {
  setupPage(renderPartnership);
});
