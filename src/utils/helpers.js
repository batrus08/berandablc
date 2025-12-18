export async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Gagal memuat data dari ${path}`);
  }
  return response.json();
}

export const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export function formatDate(dateString, localeMonthNames = monthNames) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${date.getDate().toString().padStart(2, '0')} ${localeMonthNames[date.getMonth()]} ${date.getFullYear()}`;
}

export function sortByDateDesc(items = [], key = 'date') {
  return [...items].sort((a, b) => new Date(b[key]) - new Date(a[key]));
}

export function currentMonthItems(items = [], key = 'date') {
  const now = new Date();
  return items.filter((item) => {
    const d = new Date(item[key]);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
}

export function nextUpcoming(items = [], key = 'dateStart') {
  const now = new Date();
  const upcoming = items
    .filter((item) => new Date(item[key]) >= now)
    .sort((a, b) => new Date(a[key]) - new Date(b[key]));
  return upcoming[0];
}

export function filterOngoingEvents(events = [], now = new Date()) {
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return events.filter((event) => {
    const rawStart = event.dateStart || event.startDate;
    let startDate;

    if (typeof rawStart === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawStart)) {
      const [y, m, d] = rawStart.split('-').map(Number);
      startDate = new Date(y, m - 1, d);
    } else {
      startDate = new Date(rawStart);
    }

    const rawEnd = event.dateEnd || event.endDate;
    let endDate = null;

    if (rawEnd) {
      if (typeof rawEnd === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawEnd)) {
        const [y, m, d] = rawEnd.split('-').map(Number);
        endDate = new Date(y, m - 1, d);
      } else {
        endDate = new Date(rawEnd);
      }
    }

    if (Number.isNaN(startDate.getTime())) return false;

    if (endDate && !Number.isNaN(endDate.getTime())) {
      return startDate <= now && now <= endDate;
    }

    return startDate.getTime() === startOfDay.getTime();
  });
}

export function groupByMonthYear(items = [], key = 'date') {
  return items.reduce((acc, item) => {
    const date = new Date(item[key]);
    const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {});
}
