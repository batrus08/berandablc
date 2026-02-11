import fs from 'node:fs/promises';
import path from 'node:path';

const CMS_BASE_URL = process.env.WP_BASE_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

if (!CMS_BASE_URL || !WP_USERNAME || !WP_APP_PASSWORD) {
  console.error('Set WP_BASE_URL, WP_USERNAME, dan WP_APP_PASSWORD sebelum menjalankan script ini.');
  process.exit(1);
}

const authHeader = `Basic ${Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64')}`;
const eventsPath = path.resolve(process.cwd(), 'src/data/events.json');

const safeUrl = (url) => {
  if (!url) return '';
  try {
    return new URL(url).toString();
  } catch {
    return '';
  }
};

const toAgendaPayload = (event) => ({
  title: event.title,
  slug: event.slug,
  status: 'publish',
  excerpt: event.excerpt || '',
  content: event.description || '',
  meta: {
    start_date: event.dateStart || '',
    end_date: event.dateEnd || '',
    time: event.time || '',
    location: event.location || '',
    register_url: safeUrl(event.registerUrl || ''),
    minutes_attachment_id: 0,
    report_attachment_id: 0
  }
});

const upsertAgenda = async (event) => {
  const existingRes = await fetch(`${CMS_BASE_URL.replace(/\/$/, '')}/wp-json/wp/v2/agenda?slug=${encodeURIComponent(event.slug)}`, {
    headers: { Authorization: authHeader, Accept: 'application/json' }
  });

  if (!existingRes.ok) {
    throw new Error(`Gagal cek slug ${event.slug}: ${existingRes.status}`);
  }

  const existing = await existingRes.json();
  const payload = toAgendaPayload(event);

  if (Array.isArray(existing) && existing[0]?.id) {
    const updateRes = await fetch(`${CMS_BASE_URL.replace(/\/$/, '')}/wp-json/wp/v2/agenda/${existing[0].id}`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!updateRes.ok) {
      throw new Error(`Gagal update ${event.slug}: ${updateRes.status}`);
    }

    return { action: 'updated', slug: event.slug };
  }

  const createRes = await fetch(`${CMS_BASE_URL.replace(/\/$/, '')}/wp-json/wp/v2/agenda`, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!createRes.ok) {
    throw new Error(`Gagal create ${event.slug}: ${createRes.status}`);
  }

  return { action: 'created', slug: event.slug };
};

const main = async () => {
  const raw = await fs.readFile(eventsPath, 'utf-8');
  const events = JSON.parse(raw);

  if (!Array.isArray(events)) {
    throw new Error('Format events.json tidak valid (bukan array).');
  }

  console.log(`Import ${events.length} event ke WordPress...`);
  for (const event of events) {
    const result = await upsertAgenda(event);
    const posterInfo = event.poster ? `poster(source): ${event.poster}` : 'poster(source): -';
    console.log(`- ${result.action.toUpperCase()} ${result.slug} | ${posterInfo}`);
  }

  console.log('Selesai. Poster masih dicatat sebagai sumber, upload media otomatis belum diaktifkan.');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
