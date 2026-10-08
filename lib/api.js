const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL || 'https://api.abcz.workers.dev/api/bazardor';

export async function getCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (error) {
    return [
      { id: 'chal', slug: 'chal', nameBn: 'চাল', icon: '🍚' },
      { id: 'dal', slug: 'dal', nameBn: 'ডাল', icon: '🫘' },
      { id: 'tel', slug: 'tel', nameBn: 'তেল', icon: '🛢️' },
      { id: 'sobji', slug: 'sobji', nameBn: 'সবজি', icon: '🥬' },
      { id: 'mach', slug: 'mach', nameBn: 'মাছ', icon: '🐟' },
      { id: 'mangsho', slug: 'mangsho', nameBn: 'মাংস', icon: '🍗' },
      { id: 'dim-dui', slug: 'dim-dui', nameBn: 'ডিম-দুধ', icon: '🥛' },
      { id: 'mosla', slug: 'mosla', nameBn: 'মসলা', icon: '🌶️' }
    ];
  }
}

export async function getCategoryBySlug(slug) {
  try {
    const res = await fetch(`${BASE_URL}/categories/${slug}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && !data.error) return data;
    }
  } catch (err) {}

  const all = await getCategories();
  return all.find((c) => c.slug === slug || c.id === slug) || null;
}

export async function getProducts(categorySlug = null) {
  try {
    const url = categorySlug
      ? `${BASE_URL}/products?category=${categorySlug}`
      : `${BASE_URL}/products`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

export async function getProductByIdOrSlug(idOrSlug) {
  try {
    if (!isNaN(idOrSlug)) {
      const res = await fetch(`${BASE_URL}/products/${idOrSlug}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) return data;
      }
    }

    const all = await getProducts();
    return all.find((p) => String(p.id) === String(idOrSlug) || p.slug === String(idOrSlug)) || null;
  } catch (error) {
    return null;
  }
}
