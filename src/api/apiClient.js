const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function buildUrl(path, query) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

async function parseJsonResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function apiRequest(path, { method = 'GET', query, body, headers } = {}) {
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message =
      data?.message ||
      data?.title ||
      data?.errors?.join?.(' ') ||
      `API request failed with status ${response.status}.`;

    throw new ApiError(message, {
      status: response.status,
      details: data,
    });
  }

  return data;
}

export function apiGet(path, query) {
  return apiRequest(path, { method: 'GET', query });
}

export function apiPost(path, body) {
  return apiRequest(path, { method: 'POST', body });
}

export function apiPatch(path, body) {
  return apiRequest(path, { method: 'PATCH', body });
}

export function apiPut(path, body) {
  return apiRequest(path, { method: 'PUT', body });
}

export function apiDelete(path) {
  return apiRequest(path, { method: 'DELETE' });
}
