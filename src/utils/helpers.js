export async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Gagal memuat data dari ${path}`);
  }
  return response.json();
}

export const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

/**
 * Parses a date string into a Date object.
 * Handles 'YYYY-MM-DD' as local time, avoiding UTC off-by-one errors.
 */
export function parseLocalDate(dateInput) {
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [y, m, d] = dateInput.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const date = new Date(dateInput);
  return date;
}

export function formatDate(dateString, locale = 'id-ID') {
  const date = parseLocalDate(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  // If locale is an array (legacy support), use it
  if (Array.isArray(locale)) {
     return `${date.getDate().toString().padStart(2, '0')} ${locale[date.getMonth()]} ${date.getFullYear()}`;
  }

  const effectiveLocale = locale || 'id-ID';

  // Use Intl for robust formatting
  try {
    return new Intl.DateTimeFormat(effectiveLocale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    // Fallback if locale is invalid
    return date.toLocaleDateString(effectiveLocale);
  }
}

export function sortByDateDesc(items = [], key = 'date') {
  return [...items].sort((a, b) => parseLocalDate(b[key]) - parseLocalDate(a[key]));
}

export function currentMonthItems(items = [], key = 'date') {
  const now = new Date();
  return items.filter((item) => {
    const d = parseLocalDate(item[key]);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
}

export function nextUpcoming(items = [], key = 'dateStart') {
  const now = new Date();
  const upcoming = items
    .filter((item) => parseLocalDate(item[key]) >= now)
    .sort((a, b) => parseLocalDate(a[key]) - parseLocalDate(b[key]));
  return upcoming[0];
}

export function filterOngoingEvents(events = [], now = new Date()) {
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return events.filter((event) => {
    const rawStart = event.dateStart || event.startDate;
    const startDate = parseLocalDate(rawStart);

    const rawEnd = event.dateEnd || event.endDate;
    let endDate = null;

    if (rawEnd) {
       endDate = parseLocalDate(rawEnd);
    }

    if (Number.isNaN(startDate.getTime())) return false;

    if (endDate && !Number.isNaN(endDate.getTime())) {
      // Check if "now" is between start and end (inclusive)
      // We normalize "now" to compare correctly with dates that might be 00:00:00
      // Actually, if we want to check if TODAY is within the range:
      // If start/end are 00:00:00, and now is 14:00:00, simple comparison works if start <= now <= end+1day?
      // Usually "ongoing" means the event spans across today.
      // Let's stick to the previous logic but using parsed dates.

      return startDate <= now && now <= endDate;
    }

    return startDate.getTime() === startOfDay.getTime();
  });
}

export function groupByMonthYear(items = [], key = 'date') {
  return items.reduce((acc, item) => {
    const date = parseLocalDate(item[key]);
    // Use Intl for the label or keep consistency?
    // The original used monthNames index. Let's make it consistent with the monthNames array for now to match key expectations if any.
    // Or just use Intl.
    // The function returns an object with keys like "Januari 2023".

    // We can use the exported monthNames to maintain compatibility with existing consumers relying on this format.
    const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {});
}
