/**
 * Shared helpers for Rihaaish API load tests (k6).
 *
 * Env:
 *   BASE_URL      — API origin, no trailing slash (default: production URL from app constants)
 *   API_TOKEN     — Bearer access token (with or without "Bearer " prefix) for authenticated routes
 *   SERVICE_TOKEN — optional `token` header if your backend expects it
 */
import http from 'k6/http';

const DEFAULT_BASE =
  'https://rihaish-mobile-app-backends.onrender.com';

export function getBaseUrl() {
  const raw = (__ENV.BASE_URL || DEFAULT_BASE).trim();
  return raw.replace(/\/$/, '');
}

export function authHeaders() {
  const h = { Accept: 'application/json' };
  const token = (__ENV.API_TOKEN || '').trim();
  if (token) {
    h.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  const svc = (__ENV.SERVICE_TOKEN || '').trim();
  if (svc) {
    h.token = svc;
  }
  return h;
}

/** GET relative path (e.g. api/v1/properties/all/) */
export function getPath(path) {
  const base = getBaseUrl();
  const p = path.replace(/^\//, '');
  return http.get(`${base}/${p}`, {
    headers: authHeaders(),
    timeout: '60s',
  });
}

/** POST JSON body to relative path */
export function postJson(path, body) {
  const base = getBaseUrl();
  const p = path.replace(/^\//, '');
  const headers = {
    ...authHeaders(),
    'Content-Type': 'application/json',
  };
  return http.post(`${base}/${p}`, JSON.stringify(body), {
    headers,
    timeout: '60s',
  });
}

/** Mix of endpoints the mobile app uses (read-heavy). */
export function scenarioPropertyAndProfile() {
  const paths = [
    'api/v1/properties/all/',
    'api/v1/profile/',
    'api/v1/favorites/',
  ];
  const path = paths[Math.floor(Math.random() * paths.length)];
  return getPath(path);
}

/** Larger URL surface / cache-bust for volume-style traffic. */
export function scenarioVolumeReads() {
  const n = Math.floor(Math.random() * 5000);
  return getPath(`api/v1/properties/all/?_cb=${n}`);
}
