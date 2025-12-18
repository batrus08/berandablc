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
    const startDate = new Date(event.dateStart || event.startDate);
    const endDate = event.dateEnd ? new Date(event.dateEnd) : event.endDate ? new Date(event.endDate) : null;

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
