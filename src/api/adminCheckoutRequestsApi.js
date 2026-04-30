import { apiGet, apiPatch } from './apiClient.js';

export function getAdminCheckoutRequests(filters = {}) {
  return apiGet('/admin/checkout-requests', filters);
}

export function getAdminCheckoutRequestById(id) {
  return apiGet(`/admin/checkout-requests/${encodeURIComponent(id)}`);
}

function csrfHeaders(csrfToken) {
  return { headers: { 'X-CSRF-TOKEN': csrfToken } };
}

export function updateCheckoutRequestStatus(id, status, csrfToken) {
  return apiPatch(`/admin/checkout-requests/${encodeURIComponent(id)}/status`, {
    status,
  }, csrfHeaders(csrfToken));
}

export function updateCheckoutPaymentStatus(id, paymentStatus, csrfToken) {
  return apiPatch(
    `/admin/checkout-requests/${encodeURIComponent(id)}/payment-status`,
    { paymentStatus },
    csrfHeaders(csrfToken),
  );
}

export const adminCheckoutRequestsApi = {
  getAdminCheckoutRequests,
  getAdminCheckoutRequestById,
  updateCheckoutRequestStatus,
  updateCheckoutPaymentStatus,
};
