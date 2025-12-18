export function renderFooter() {
  return `
    <footer class="footer" id="site-footer">
      <div class="container footer__grid">
        <div class="footer__brand">
          <div class="brand__mark">LC</div>
          <p class="brand__name" data-i18n="brand.name"></p>
        </div>
        <div class="footer__info">
          <h4 data-i18n="navbar.kontak"></h4>
          <p data-i18n="footer.address"></p>
          <p>
            <span data-i18n="footer.phone"></span><br />
            <a href="mailto:lawcommunity@fh.ac.id">lawcommunity@fh.ac.id</a>
          </p>
        </div>
        <div>
          <h4 data-i18n="navbar.beranda"></h4>
          <ul class="footer__nav">
            <li><a href="/src/pages/index.html" data-i18n="navbar.beranda"></a></li>
            <li><a href="/src/pages/articles.html" data-i18n="navbar.artikel"></a></li>
            <li><a href="/src/pages/events.html" data-i18n="navbar.kegiatan"></a></li>
            <li><a href="/src/pages/contact.html" data-i18n="navbar.kontak"></a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p data-i18n="footer.copyright"></p>
      </div>
    </footer>
  `;
}
