import { API_BASE_URL } from './apiClient.js';

const fallbackToneByCategory = {
  Phones: 'from-zinc-950 via-zinc-800 to-slate-300',
  Cases: 'from-stone-950 via-zinc-800 to-zinc-300',
  Charging: 'from-zinc-950 via-neutral-800 to-amber-200',
  Audio: 'from-stone-900 via-zinc-700 to-stone-200',
  Wearables: 'from-neutral-950 via-stone-800 to-amber-200',
  Accessories: 'from-zinc-950 via-neutral-800 to-emerald-200',
};

function resolveImageUrl(url) {
  if (!url) {
    return null;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return new URL(url, API_BASE_URL).toString();
}

export function normalizeProductImage(image) {
  return {
    id: image.id,
    url: resolveImageUrl(image.url),
    fileName: image.fileName,
    originalFileName: image.originalFileName,
    contentType: image.contentType,
    sizeBytes: image.sizeBytes,
    altText: image.altText,
    isPrimary: Boolean(image.isPrimary),
    uploadedAt: image.uploadedAt,
  };
}

export function normalizeProduct(product) {
  const category = product.category ?? product.categoryName ?? 'Accessories';
  const images = Array.isArray(product.images)
    ? product.images.map(normalizeProductImage)
    : [];
  const primaryImage =
    images.find((image) => image.isPrimary) || images[0] || null;

  return {
    id: product.id,
    name: product.name,
    category,
    categoryId: product.categoryId,
    categoryName: product.categoryName ?? category,
    finish: product.finish ?? '',
    spec: product.spec ?? '',
    shortDescription: product.shortDescription ?? '',
    features: Array.isArray(product.features) ? product.features : [],
    priceCents: product.priceCents,
    currency: product.currency ?? 'USD',
    inStock: Boolean(product.inStock),
    stockStatus: product.stockStatus ?? '',
    visual: product.visual || 'phone',
    tone:
      product.tone ||
      fallbackToneByCategory[category] ||
      fallbackToneByCategory.Accessories,
    images,
    primaryImageUrl: resolveImageUrl(product.primaryImageUrl) || primaryImage?.url,
    primaryImage,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function normalizeProducts(products) {
  return Array.isArray(products) ? products.map(normalizeProduct) : [];
}

export function normalizeCategory(category) {
  return {
    id: category.id,
    name: category.name,
    description: category.description ?? '',
    sortOrder: category.sortOrder ?? 0,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function normalizeCategories(categories) {
  return Array.isArray(categories) ? categories.map(normalizeCategory) : [];
}
