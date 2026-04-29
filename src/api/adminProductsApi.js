import { apiDelete, apiGet, apiPost, apiPut } from './apiClient.js';

export function getAdminProducts(filters = {}) {
  return apiGet('/admin/products', filters);
}

export function getAdminProductById(id) {
  return apiGet(`/admin/products/${encodeURIComponent(id)}`);
}

export function createAdminProduct(payload) {
  return apiPost('/admin/products', payload);
}

export function updateAdminProduct(id, payload) {
  return apiPut(`/admin/products/${encodeURIComponent(id)}`, payload);
}

export function deleteAdminProduct(id) {
  return apiDelete(`/admin/products/${encodeURIComponent(id)}`);
}

export const adminProductsApi = {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
};
