/**
 * Stress testing — ramp virtual users until the system degrades; finds breaking point.
 * Expect rising latency or 5xx/timeouts under peak; use only on environments you own.
 *
 * Run: k6 run load-testing/stress.js
 * Tune: STRESS_PEAK_VUS=200 k6 run load-testing/stress.js
 */
import { check, sleep } from 'k6';
import { scenarioPropertyAndProfile } from './lib/shared.js';

const peak = Number(__ENV.STRESS_PEAK_VUS || 120);

export const options = {
  stages: [
    { duration: '1m', target: Math.max(10, Math.floor(peak * 0.08)) },
    { duration: '2m', target: Math.floor(peak * 0.25) },
    { duration: '2m', target: Math.floor(peak * 0.5) },
    { duration: '2m', target: peak },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    // Under stress we only assert the runner stayed up; tighten in CI against mocks
    http_req_failed: ['rate<0.5'],
  },
};

export default function () {
  const res = scenarioPropertyAndProfile();
  check(res, {
    'got response': c => c.status > 0,
  });
  sleep(0.05 + Math.random() * 0.15);
}
