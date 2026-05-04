/**
 * Endurance / soak testing — moderate load for a long time to catch leaks,
 * connection pool exhaustion, or slow degradation.
 *
 * Run: k6 run load-testing/soak.js
 * Tune: SOAK_VUS=8 SOAK_DURATION=15m k6 run load-testing/soak.js
 */
import { check, sleep } from 'k6';
import { scenarioPropertyAndProfile } from './lib/shared.js';

export const options = {
  vus: Number(__ENV.SOAK_VUS || 6),
  duration: __ENV.SOAK_DURATION || '12m',
  thresholds: {
    http_req_failed: ['rate<0.08'],
    http_req_duration: ['p(95)<6000'],
  },
};

export default function () {
  const res = scenarioPropertyAndProfile();
  check(res, {
    'status is 2xx or 401': c =>
      (c.status >= 200 && c.status < 300) || c.status === 401,
  });
  sleep(0.5 + Math.random() * 1.0);
}
