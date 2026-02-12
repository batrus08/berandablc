import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentDetail from '../components/ContentDetail.tsx';
import { getBySlug } from '../services/contentService';
import { ContentItem } from '../types/content';

interface SectionDetailPageProps {
  title: string;
  basePath: string;
}

const SectionDetailPage = ({ title, basePath }: SectionDetailPageProps) => {
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
        const result = await getBySlug('posts', slug, title, basePath);
        if (!result) {
          setError(`${title} tidak ditemukan.`);
        }
        setItem(result as ContentItem);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [basePath, slug, title]);

  if (loading) return <div className="status">Memuat {title.toLowerCase()}...</div>;
  if (error) return <div className="status">{error}</div>;
  if (!item) return <div className="status">{title} tidak tersedia.</div>;

  return <ContentDetail item={item} />;
};

export default SectionDetailPage;
