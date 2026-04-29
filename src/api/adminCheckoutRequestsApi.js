import { apiGet, apiPatch } from './apiClient.js';

export function getAdminCheckoutRequests(filters = {}) {
  return apiGet('/admin/checkout-requests', filters);
}

export function getAdminCheckoutRequestById(id) {
  return apiGet(`/admin/checkout-requests/${encodeURIComponent(id)}`);
}

export function updateCheckoutRequestStatus(id, status) {
  return apiPatch(`/admin/checkout-requests/${encodeURIComponent(id)}/status`, {
    status,
  });
}

export function updateCheckoutPaymentStatus(id, paymentStatus) {
  return apiPatch(
    `/admin/checkout-requests/${encodeURIComponent(id)}/payment-status`,
    { paymentStatus },
  );
}

export const adminCheckoutRequestsApi = {
  getAdminCheckoutRequests,
  getAdminCheckoutRequestById,
  updateCheckoutRequestStatus,
  updateCheckoutPaymentStatus,
};
