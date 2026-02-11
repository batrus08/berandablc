import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentDetail from '../components/ContentDetail.tsx';
import { getBySlug } from '../services/contentService';
import { ContentItem } from '../types/content';

const AgendaDetailPage = () => {
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
        const result = await getBySlug('agenda', slug);
        if (!result) {
          setError('Agenda tidak ditemukan.');
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

  if (loading) return <div className="status">Memuat agenda...</div>;
  if (error) return <div className="status">{error}</div>;
  if (!item) return <div className="status">Agenda tidak tersedia.</div>;

  return <ContentDetail item={item} />;
};

export default AgendaDetailPage;
