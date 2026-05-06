import { apiDelete, apiGet, apiPatch, apiPost } from './apiClient.js';

function csrfHeaders(csrfToken) {
  return { headers: { 'X-CSRF-TOKEN': csrfToken } };
}

export function getProductImages(productId) {
  return apiGet(`/admin/products/${encodeURIComponent(productId)}/images`);
}

export function uploadProductImage(
  productId,
  { file, altText, setPrimary },
  csrfToken,
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('setPrimary', String(Boolean(setPrimary)));

  if (altText) {
    formData.append('altText', altText);
  }

  return apiPost(
    `/admin/products/${encodeURIComponent(productId)}/images`,
    formData,
    csrfHeaders(csrfToken),
  );
}

export function setPrimaryProductImage(productId, imageId, csrfToken) {
  return apiPatch(
    `/admin/products/${encodeURIComponent(productId)}/images/${encodeURIComponent(
      imageId,
    )}/primary`,
    {},
    csrfHeaders(csrfToken),
  );
}

export function deleteProductImage(productId, imageId, csrfToken) {
  return apiDelete(
    `/admin/products/${encodeURIComponent(productId)}/images/${encodeURIComponent(
      imageId,
    )}`,
    csrfHeaders(csrfToken),
  );
}

export const adminProductImagesApi = {
  getProductImages,
  uploadProductImage,
  setPrimaryProductImage,
  deleteProductImage,
};
