import { apiDelete, apiGet, apiPost, apiPut } from './apiClient.js';

export function getAdminProducts(filters = {}) {
  return apiGet('/admin/products', filters);
}

export function getAdminProductById(id) {
  return apiGet(`/admin/products/${encodeURIComponent(id)}`);
}

function csrfHeaders(csrfToken) {
  return { headers: { 'X-CSRF-TOKEN': csrfToken } };
}

export function createAdminProduct(payload, csrfToken) {
  return apiPost('/admin/products', payload, csrfHeaders(csrfToken));
}

export function updateAdminProduct(id, payload, csrfToken) {
  return apiPut(
    `/admin/products/${encodeURIComponent(id)}`,
    payload,
    csrfHeaders(csrfToken),
  );
}

export function deleteAdminProduct(id, csrfToken) {
  return apiDelete(
    `/admin/products/${encodeURIComponent(id)}`,
    csrfHeaders(csrfToken),
  );
}

export const adminProductsApi = {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
};
