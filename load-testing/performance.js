/**
 * Performance testing — baseline latency and stability under light, controlled load.
 * Focus: p95/p99 response times and low error rate at a few virtual users.
 *
 * Run: k6 run load-testing/performance.js
 * Optional: BASE_URL=... API_TOKEN=... k6 run load-testing/performance.js
 */
import { check, sleep } from 'k6';
import { scenarioPropertyAndProfile } from './lib/shared.js';

export const options = {
  vus: Number(__ENV.PERF_VUS || 3),
  duration: __ENV.PERF_DURATION || '2m',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<4000', 'p(99)<8000'],
  },
};

export default function () {
  const res = scenarioPropertyAndProfile();
  check(res, {
    'status is 2xx or 401': c =>
      (c.status >= 200 && c.status < 300) || c.status === 401,
  });
  sleep(0.3 + Math.random() * 0.5);
}
