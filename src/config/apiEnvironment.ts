import { api_urls } from '../utilities/constants';

export const MOCK_API_BASE_URL = 'https://mock.rihaaish.invalid/v1/';

export function getApiBaseUrl(): string {
  const trimmed = (api_urls.base_url ?? '').trim();
  return trimmed.length > 0 ? trimmed : MOCK_API_BASE_URL;
}

/** When false, the real `api_urls.base_url` is used and the mock adapter is not applied. */
export function isMockApiEnabled(): boolean {
  return (api_urls.base_url ?? '').trim().length === 0;
}

type NodeishProcess = { env?: Record<string, string | undefined> };

function getProcess(): NodeishProcess | undefined {
  return (globalThis as typeof globalThis & { process?: NodeishProcess })
    .process;
}

export function isTestEnvironment(): boolean {
  const env = getProcess()?.env;
  return env?.NODE_ENV === 'test' || Boolean(env?.JEST_WORKER_ID);
}
