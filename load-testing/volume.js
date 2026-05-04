/**
 * Volume testing — high request count and varied query surface in a short window.
 * Exercises throughput and caching layers (many distinct URLs via cache-bust params).
 *
 * Run: k6 run load-testing/volume.js
 * Tune: VOLUME_VUS=50 VOLUME_DURATION=3m k6 run load-testing/volume.js
 */
import { check, sleep } from 'k6';
import { scenarioVolumeReads } from './lib/shared.js';

export const options = {
  vus: Number(__ENV.VOLUME_VUS || 40),
  duration: __ENV.VOLUME_DURATION || '3m',
  thresholds: {
    http_req_failed: ['rate<0.15'],
    http_reqs: ['count>500'],
  },
};

export default function () {
  const res = scenarioVolumeReads();
  check(res, {
    'status is 2xx or 401': c =>
      (c.status >= 200 && c.status < 300) || c.status === 401,
  });
  sleep(0.02 + Math.random() * 0.08);
}
