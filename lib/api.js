// API থেকে ডাটা ফেচ করার ফাংশনসমূহ

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL || 'https://api.abcz.workers.dev/api/bazardor';

// সব ক্যাটাগরি পাওয়ার ফাংশন
export async function getCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (error) {
    console.log('Categories fetch error:', error);
    // ব্যাকআপ ক্যাটাগরি তালিকা
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

// নির্দিষ্ট একটি ক্যাটাগরি পাওয়ার ফাংশন
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

// সব পণ্য অথবা ক্যাটাগরি অনুযায়ী পণ্য পাওয়ার ফাংশন
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
    console.log('Products fetch error:', error);
    return [];
  }
}

// সিঙ্গেল পণ্যের বিস্তারিত পাওয়ার ফাংশন (ID বা Slug দিয়ে)
export async function getProductByIdOrSlug(idOrSlug) {
  try {
    // যদি আইডি সংখ্যা হয়
    if (!isNaN(idOrSlug)) {
      const res = await fetch(`${BASE_URL}/products/${idOrSlug}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) return data;
      }
    }

    // অন্যথায় সব প্রোডাক্ট থেকে খুঁজে বের করি
    const all = await getProducts();
    return all.find((p) => String(p.id) === String(idOrSlug) || p.slug === String(idOrSlug)) || null;
  } catch (error) {
    console.log('Single product fetch error:', error);
    return null;
  }
}
