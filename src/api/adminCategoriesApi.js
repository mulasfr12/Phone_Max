import { apiDelete, apiGet, apiPost, apiPut } from './apiClient.js';

export function getAdminCategories() {
  return apiGet('/admin/categories');
}

export function getAdminCategoryById(id) {
  return apiGet(`/admin/categories/${encodeURIComponent(id)}`);
}

export function createAdminCategory(payload) {
  return apiPost('/admin/categories', payload);
}

export function updateAdminCategory(id, payload) {
  return apiPut(`/admin/categories/${encodeURIComponent(id)}`, payload);
}

export function deleteAdminCategory(id) {
  return apiDelete(`/admin/categories/${encodeURIComponent(id)}`);
}

export const adminCategoriesApi = {
  getAdminCategories,
  getAdminCategoryById,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
};
