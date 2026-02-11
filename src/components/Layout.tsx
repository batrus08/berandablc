import { Link } from 'react-router-dom';

interface LayoutProps {
  currentPath: string;
  children: React.ReactNode;
}

const navItems = [
  { path: '/artikel', label: 'Artikel' },
  { path: '/agenda', label: 'Agenda' }
];

const Layout = ({ currentPath, children }: LayoutProps) => {
  return (
    <div className="app-shell">
      <header>
        <div>
          <h1 style={{ margin: 0 }}>Beranda BLC</h1>
          <p style={{ margin: '4px 0 0', color: '#475569' }}>
            Konten diambil secara langsung dari WordPress (headless).
          </p>
        </div>
        <nav aria-label="Navigasi utama">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={currentPath.startsWith(item.path) ? 'active' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
