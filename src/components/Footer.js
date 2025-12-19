export function renderFooter() {
  const logoSrc = new URL('../assets/images/logoblc.png', import.meta.url).href;
  return `
    <footer class="footer" id="site-footer">
      <div class="container footer__grid">
        <div class="footer__brand">
          <img class="brand__mark" src="${logoSrc}" alt="Law Community logo" />
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
            <li><a href="${new URL('../pages/index.html', import.meta.url).href}" data-i18n="navbar.beranda"></a></li>
            <li><a href="${new URL('../pages/articles.html', import.meta.url).href}" data-i18n="navbar.artikel"></a></li>
            <li><a href="${new URL('../pages/events.html', import.meta.url).href}" data-i18n="navbar.kegiatan"></a></li>
            <li><a href="${new URL('../pages/contact.html', import.meta.url).href}" data-i18n="navbar.kontak"></a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p data-i18n="footer.copyright"></p>
      </div>
    </footer>
  `;
}
