import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import AgendaPage from './pages/AgendaPage';
import AgendaDetailPage from './pages/AgendaDetailPage';

const App = () => {
  const location = useLocation();

  return (
    <Layout currentPath={location.pathname}>
      <Routes>
        <Route path="/" element={<Navigate to="/artikel" replace />} />
        <Route path="/artikel" element={<ArticlesPage />} />
        <Route path="/artikel/:slug" element={<ArticleDetailPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/agenda/:slug" element={<AgendaDetailPage />} />
        <Route path="*" element={<Navigate to="/artikel" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
