import { ApiError } from '../api/apiClient.js';

export const adminSecurityTokenNotReadyMessage =
  'Admin actions are unavailable while the security token is loading.';

export const adminSecurityTokenExpiredMessage =
  'Your admin security token expired. Refresh the page and try again.';

export function getAdminMutationErrorMessage(error, fallbackMessage) {
  if (error instanceof ApiError && error.status === 403) {
    return adminSecurityTokenExpiredMessage;
  }

  return error.message || fallbackMessage;
}
