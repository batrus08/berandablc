import { AgendaItem, ContentItem } from '../types/content';
import { sanitizeContent, sanitizeSnippet } from '../utils/sanitizeHtml';

const fallbackImage = '/placeholder.svg';

interface ContentDetailProps {
  item: ContentItem | AgendaItem;
}

const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate) return 'Tanggal belum ditentukan';
  const start = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) return 'Tanggal belum ditentukan';

  const startText = start.toLocaleDateString('id-ID');
  if (!endDate) return startText;

  const end = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(end.getTime())) return startText;

  return `${startText} - ${end.toLocaleDateString('id-ID')}`;
};

const ContentDetail = ({ item }: ContentDetailProps) => {
  const isAgenda = item.type === 'agenda';
  const agendaItem = isAgenda ? (item as AgendaItem) : null;

  return (
    <article className="detail">
      <div className="meta">
        <span>{item.type === 'article' ? 'Artikel' : 'Agenda'}</span>
        <span>•</span>
        <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
      </div>
      <h1>{item.title}</h1>
      <img src={item.featuredImageUrl || fallbackImage} alt={item.title} />
      {isAgenda && agendaItem && (
        <div className="agenda-details">
          <h3>Detail Agenda</h3>
          <dl>
            <div className="detail-row">
              <dt>Tanggal</dt>
              <dd>{formatDateRange(agendaItem.startDate, agendaItem.endDate)}</dd>
            </div>
            {agendaItem.time && (
              <div className="detail-row">
                <dt>Jam</dt>
                <dd>{agendaItem.time}</dd>
              </div>
            )}
            {agendaItem.location && (
              <div className="detail-row">
                <dt>Lokasi</dt>
                <dd>{agendaItem.location}</dd>
              </div>
            )}
            {agendaItem.registerUrl && (
              <div className="detail-row">
                <dt>Pendaftaran</dt>
                <dd>
                  <a href={agendaItem.registerUrl} target="_blank" rel="noreferrer">
                    Daftar
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
      <div className="body">
        <div
          className="excerpt"
          dangerouslySetInnerHTML={{ __html: sanitizeSnippet(item.excerpt) }}
        />
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: sanitizeContent(item.content) }}
        />
      </div>
    </article>
  );
};

export default ContentDetail;
