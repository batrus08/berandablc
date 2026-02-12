import { useEffect, useState } from 'react';
import { getPageBySlug } from '../services/contentService';
import { PageItem } from '../types/content';
import { sanitizeContent } from '../utils/sanitizeHtml';

interface WpPageProps {
  titleFallback: string;
  slug: string;
}

const WpPage = ({ titleFallback, slug }: WpPageProps) => {
  const [page, setPage] = useState<PageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getPageBySlug(slug);
        if (!result) {
          setError(`Halaman ${titleFallback} belum tersedia di WordPress.`);
        }
        setPage(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, titleFallback]);

  if (loading) return <div className="status">Memuat halaman {titleFallback.toLowerCase()}...</div>;
  if (error) return <div className="status">{error}</div>;
  if (!page) return <div className="status">Konten tidak tersedia.</div>;

  return (
    <article className="detail">
      <h1>{page.title || titleFallback}</h1>
      <div dangerouslySetInnerHTML={{ __html: sanitizeContent(page.content) }} />
    </article>
  );
};

export default WpPage;
