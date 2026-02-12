import { useEffect, useState } from 'react';
import ContentCard from '../components/ContentCard.tsx';
import { getSectionPosts } from '../services/contentService';
import { ContentItem } from '../types/content';

interface SectionListPageProps {
  section: 'kegiatan' | 'kerjasama' | 'galeri';
  title: string;
  basePath: string;
}

const SectionListPage = ({ section, title, basePath }: SectionListPageProps) => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getSectionPosts(section, title, basePath, page);
        setItems(result.items);
        setTotalPages(result.totalPages);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [basePath, page, section, title]);

  return (
    <div>
      <h2>{title}</h2>
      {loading && <div className="status">Memuat {title.toLowerCase()}...</div>}
      {error && !loading && <div className="status">Terjadi kesalahan: {error}</div>}
      {!loading && !error && items.length === 0 && (
        <div className="status">Belum ada konten {title.toLowerCase()} untuk ditampilkan.</div>
      )}
      {!loading && !error && items.length > 0 && (
        <>
          <div className="grid">
            {items.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
          <div className="pagination" aria-label={`Navigasi halaman ${title.toLowerCase()}`}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Sebelumnya
            </button>
            <span>
              Halaman {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Selanjutnya
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SectionListPage;
