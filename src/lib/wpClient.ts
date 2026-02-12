const baseUrl = import.meta.env.VITE_WP_BASE_URL?.replace(/\/$/, '') || '';

if (!baseUrl) {
  console.warn('VITE_WP_BASE_URL belum diset. Permintaan ke WordPress akan gagal.');
}

export type Query = Record<string, string | number | boolean | undefined>;

export const buildUrl = (path: string, query?: Query) => {
  const url = new URL(path, baseUrl || window.location.origin);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
};

export const fetchJson = async <T>(
  path: string,
  query?: Query
): Promise<{ data: T; totalPages?: number }> => {
  const url = buildUrl(path, query);

  let response: Response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch (error) {
    throw new Error(`Gagal terhubung ke WordPress: ${(error as Error).message}`);
  }

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(`Permintaan gagal (${response.status}): ${message || response.statusText}`);
  }

  const totalPagesHeader = response.headers.get('X-WP-TotalPages');
  const totalPages = totalPagesHeader ? Number(totalPagesHeader) : undefined;
  const data = (await response.json()) as T;
  return { data, totalPages };
};
