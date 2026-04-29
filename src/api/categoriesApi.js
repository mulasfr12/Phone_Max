import { apiGet } from './apiClient.js';

export function getCategories() {
  return apiGet('/categories');
}

export const categoriesApi = {
  getCategories,
};
