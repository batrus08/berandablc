export async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Gagal memuat data dari ${path}`);
  }
  return response.json();
}

export function sortByDateDesc(items = []) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
