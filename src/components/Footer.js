export function renderFooter() {
  const currentYear = new Date().getFullYear();
  return `
    <footer class="site-footer">
      <div class="container site-footer__inner">
        <div>
          <h3>Business Law Community</h3>
          <p>Kolaborasi akademisi dan praktisi hukum bisnis.</p>
          <p class="site-footer__copyright">&copy; ${currentYear} BLC Fakultas Hukum. All rights reserved.</p>
        </div>
        <div class="site-footer__links">
          <h4>Ikuti Kami</h4>
          <ul>
            <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a href="https://twitter.com/" target="_blank" rel="noopener">Twitter</a></li>
            <li><a href="https://instagram.com/" target="_blank" rel="noopener">Instagram</a></li>
          </ul>
        </div>
      </div>
    </footer>
  `;
}
