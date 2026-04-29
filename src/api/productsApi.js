import { apiGet } from './apiClient.js';

export function getProducts(filters = {}) {
  return apiGet('/products', filters);
}

export function getProductById(id) {
  return apiGet(`/products/${encodeURIComponent(id)}`);
}

export const productsApi = {
  getProducts,
  getProductById,
};
