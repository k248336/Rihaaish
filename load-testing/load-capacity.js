/**
 * Load / capacity testing — sustained traffic at a target level (expected peak).
 * Validates the system can carry nominal concurrent users for a period of time.
 *
 * Run: k6 run load-testing/load-capacity.js
 * Tune: LOAD_VUS=40 LOAD_DURATION=5m k6 run load-testing/load-capacity.js
 */
import { check, sleep } from 'k6';
import { scenarioPropertyAndProfile } from './lib/shared.js';

export const options = {
  stages: [
    { duration: '30s', target: Number(__ENV.LOAD_VUS || 25) },
    { duration: __ENV.LOAD_DURATION || '4m', target: Number(__ENV.LOAD_VUS || 25) },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.1'],
    http_req_duration: ['p(95)<5000'],
  },
};

export default function () {
  const res = scenarioPropertyAndProfile();
  check(res, {
    'status is 2xx or 401': c =>
      (c.status >= 200 && c.status < 300) || c.status === 401,
  });
  sleep(0.2 + Math.random() * 0.4);
}
