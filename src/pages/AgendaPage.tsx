import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContentCard from '../components/ContentCard';
import { getAgenda } from '../services/contentService';
import { AgendaItem } from '../types/content';

const AgendaPage = () => {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getAgenda(page);
        setItems(result.items);
        setTotalPages(result.totalPages);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const sortedItems = useMemo(() => {
    const itemsWithDates = [...items];
    itemsWithDates.sort((a, b) => {
      const dateA = a.startDate ? new Date(`${a.startDate}T00:00:00`).getTime() : null;
      const dateB = b.startDate ? new Date(`${b.startDate}T00:00:00`).getTime() : null;

      if (dateA !== null && dateB !== null) {
        return dateA - dateB;
      }
      if (dateA !== null) return -1;
      if (dateB !== null) return 1;
      return 0;
    });
    return itemsWithDates;
  }, [items]);

  const filteredItems = useMemo(() => {
    const upcoming = searchParams.get('upcoming');
    if (upcoming !== '1') return sortedItems;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return sortedItems.filter((item) => {
      if (!item.startDate) return false;
      const start = new Date(`${item.startDate}T00:00:00`);
      if (Number.isNaN(start.getTime())) return false;
      return start.getTime() >= today.getTime();
    });
  }, [searchParams, sortedItems]);

  return (
    <div>
      <h2>Agenda</h2>
      {loading && <div className="status">Memuat agenda...</div>}
      {error && !loading && <div className="status">Terjadi kesalahan: {error}</div>}
      {!loading && !error && filteredItems.length === 0 && (
        <div className="status">Belum ada agenda untuk ditampilkan.</div>
      )}
      {!loading && !error && filteredItems.length > 0 && (
        <>
          <div className="grid">
            {filteredItems.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
          <div className="pagination" aria-label="Navigasi halaman agenda">
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

export default AgendaPage;
