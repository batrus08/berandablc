import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentDetail from '../components/ContentDetail';
import { getBySlug } from '../services/contentService';
import { ContentItem } from '../types/content';

const ArticleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const result = await getBySlug('posts', slug);
        if (!result) {
          setError('Artikel tidak ditemukan.');
        }
        setItem(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <div className="status">Memuat artikel...</div>;
  if (error) return <div className="status">{error}</div>;
  if (!item) return <div className="status">Artikel tidak tersedia.</div>;

  return <ContentDetail item={item} />;
};

export default ArticleDetailPage;
