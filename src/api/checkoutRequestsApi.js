import { apiPost } from './apiClient.js';

export function createCheckoutRequest(payload) {
  return apiPost('/checkout-requests', payload);
}

export const checkoutRequestsApi = {
  createCheckoutRequest,
};
