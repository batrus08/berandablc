import { renderTopbar } from './Topbar.js';
import { renderNavbar, bindDropdowns } from './Navbar.js';
import { renderFooter } from './Footer.js';
import { qs, setHTML } from '../utils/dom.js';

export function mountLayout() {
  setHTML(qs('#topbar-root'), renderTopbar());
  setHTML(qs('#navbar-root'), renderNavbar());
  setHTML(qs('#footer-root'), renderFooter());
  bindDropdowns(document);
}
