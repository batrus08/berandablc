export async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Gagal memuat data dari ${path}`);
  }
  return response.json();
}

export function mergeAndSortContent(news = [], articles = [], limit = 6) {
  const combined = [...news, ...articles].map((item) => ({
    ...item,
    date: item.date,
  }));

  combined.sort((a, b) => new Date(b.date) - new Date(a.date));
  return combined.slice(0, limit);
}

export function renderFocusCategories(categories = []) {
  return categories
    .map(
      (category) => `
        <div class="focus-card">
          <h3>${category.title}</h3>
          <p>${category.description}</p>
        </div>
      `
    )
    .join('');
}
