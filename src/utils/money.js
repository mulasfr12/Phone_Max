export function formatPrice(priceCents, currency = 'USD') {
  const amount = Number(priceCents) / 100;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function parsePriceToCents(price) {
  const numericPrice = Number(String(price).replace(/[^0-9.]/g, ''));
  return Number.isFinite(numericPrice) ? Math.round(numericPrice * 100) : 0;
}
