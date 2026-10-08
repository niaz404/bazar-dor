// API Service for B14-A7 Bazar Dor

const PRIMARY_BASE_URL = 'https://api.abcz.workers.dev/api/bazardor';
const BACKUP_BASE_URL = 'https://api.api-store.workers.dev/api/bazardor';

async function fetchFromApi(endpoint) {
  try {
    const res = await fetch(`${PRIMARY_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 } // Next.js ISR revalidation
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Primary API failed for ${endpoint}, trying backup...`, err.message);
  }

  try {
    const res = await fetch(`${BACKUP_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error(`Backup API failed for ${endpoint}:`, err.message);
  }

  return null;
}

/**
 * Fetch all categories
 */
export async function getCategories() {
  const data = await fetchFromApi('/categories');
  if (Array.isArray(data) && data.length > 0) {
    return data;
  }
  // Fallback categories
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

/**
 * Fetch a single category by slug
 */
export async function getCategoryBySlug(slug) {
  const data = await fetchFromApi(`/categories/${slug}`);
  if (data && !data.error) {
    return data;
  }
  const allCategories = await getCategories();
  return allCategories.find((c) => c.slug === slug || c.id === slug) || null;
}

/**
 * Fetch all products or filter by category
 */
export async function getProducts(categorySlug = null) {
  const endpoint = categorySlug ? `/products?category=${categorySlug}` : '/products';
  const data = await fetchFromApi(endpoint);
  
  if (Array.isArray(data)) {
    return data;
  }
  
  // If category filtering returned null or empty, fetch all and filter client-side
  if (categorySlug) {
    const all = await fetchFromApi('/products');
    if (Array.isArray(all)) {
      return all.filter((p) => p.category === categorySlug);
    }
  }
  
  return [];
}

/**
 * Fetch a single product by numeric ID or slug string
 */
export async function getProductByIdOrSlug(idOrSlug) {
  // If it's a numeric ID
  if (!isNaN(idOrSlug)) {
    const data = await fetchFromApi(`/products/${idOrSlug}`);
    if (data && !data.error && data.id) {
      return data;
    }
  }

  // Otherwise search across all products by slug or ID
  const allProducts = await getProducts();
  const found = allProducts.find(
    (p) => String(p.id) === String(idOrSlug) || p.slug === String(idOrSlug)
  );
  
  return found || null;
}
