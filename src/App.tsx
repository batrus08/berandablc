import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import AgendaDetailPage from './pages/AgendaDetailPage';
import AgendaPage from './pages/AgendaPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ArticlesPage from './pages/ArticlesPage';
import SectionDetailPage from './pages/SectionDetailPage';
import SectionListPage from './pages/SectionListPage';
import WpPage from './pages/WpPage';

const aboutSlug = import.meta.env.VITE_WP_PAGE_ABOUT_SLUG || 'tentang-kami';
const contactSlug = import.meta.env.VITE_WP_PAGE_CONTACT_SLUG || 'kontak';
const homeSlug = import.meta.env.VITE_WP_PAGE_HOME_SLUG || 'beranda';

const App = () => {
  const location = useLocation();

  return (
    <Layout currentPath={location.pathname}>
      <Routes>
        <Route path="/" element={<WpPage titleFallback="Beranda" slug={homeSlug} />} />
        <Route path="/tentang-kami" element={<WpPage titleFallback="Tentang Kami" slug={aboutSlug} />} />

        <Route path="/artikel" element={<ArticlesPage />} />
        <Route path="/artikel/:slug" element={<ArticleDetailPage />} />

        <Route path="/kegiatan" element={<SectionListPage section="kegiatan" title="Kegiatan" basePath="/kegiatan" />} />
        <Route path="/kegiatan/:slug" element={<SectionDetailPage title="Kegiatan" basePath="/kegiatan" />} />

        <Route path="/kerjasama" element={<SectionListPage section="kerjasama" title="Kerjasama" basePath="/kerjasama" />} />
        <Route path="/kerjasama/:slug" element={<SectionDetailPage title="Kerjasama" basePath="/kerjasama" />} />

        <Route path="/galeri" element={<SectionListPage section="galeri" title="Galeri" basePath="/galeri" />} />
        <Route path="/galeri/:slug" element={<SectionDetailPage title="Galeri" basePath="/galeri" />} />

        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/agenda/:slug" element={<AgendaDetailPage />} />

        <Route path="/kontak" element={<WpPage titleFallback="Kontak" slug={contactSlug} />} />
        <Route path="*" element={<Navigate to="/tentang-kami" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
