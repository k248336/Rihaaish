import type { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  mockAuthUser,
  mockNotificationsPayload,
} from './mockFixtures';

let adapter: MockAdapter | null = null;

function normalizePath(fullUrl: string): string {
  if (!fullUrl) {
    return '';
  }
  try {
    const u = new URL(fullUrl);
    return u.pathname.replace(/^\/v1\//, '').replace(/^\//, '');
  } catch {
    return fullUrl.replace(/^\/+/, '');
  }
}

/**
 * Registers deterministic responses for every endpoint used by current Redux thunks.
 */
export function applyMockAdapter(client: AxiosInstance): void {
  if (adapter) {
    return;
  }

  adapter = new MockAdapter(client, { delayResponse: 0 });

  const loginShape = { data: { ...mockAuthUser } };

  adapter.onAny().reply(config => {
    const method = (config.method || 'get').toLowerCase();
    const path = normalizePath(config.url || '');

    const ok = (body: unknown, status = 200) => [status, body] as const;

    if (method === 'post' && path === 'user/login') {
      return ok(loginShape);
    }
    if (method === 'post' && path === 'user/social-login') {
      return ok(loginShape);
    }
    if (method === 'post' && path === 'user') {
      return ok({ data: { message: 'Registered (mock)' } });
    }
    if (method === 'get' && path === 'user') {
      const { api_token: _t, ...profile } = mockAuthUser as Record<
        string,
        unknown
      >;
      return ok({ data: profile });
    }
    if (method === 'patch' && path === 'user') {
      let body: Record<string, unknown> = {};
      try {
        body =
          typeof config.data === 'string' && config.data
            ? (JSON.parse(config.data) as Record<string, unknown>)
            : ((config.data as Record<string, unknown>) ?? {});
      } catch {
        body = {};
      }
      return ok({ data: { ...mockAuthUser, ...body } });
    }
    if (method === 'post' && path === 'user/upload-attachments') {
      return ok({ data: { url: 'https://mock.rihaaish.invalid/file.jpg' } });
    }
    if (method === 'post' && path === 'user/send-otp/mail') {
      return ok({ data: { message: 'OTP sent (mock)' } });
    }
    if (method === 'post' && path === 'user/verify-otp/register') {
      return ok(loginShape);
    }
    if (method === 'post' && path === 'user/verify-otp/forgot-password') {
      return ok({
        data: { ...mockAuthUser, api_token: 'mock-reset-token' },
      });
    }
    if (method === 'post' && path === 'user/set-password') {
      return ok({ data: { message: 'Password updated (mock)' } });
    }
    if (method === 'post' && path === 'user/change-password') {
      return ok({ data: { message: 'Password changed (mock)' } });
    }
    if (method === 'post' && path === 'user/logout') {
      return ok({ data: {} });
    }
    if (method === 'delete' && path === 'user') {
      return ok({ data: {} });
    }
    if (method === 'post' && path === 'user/toggle-notification') {
      return ok({ data: { push_notification: true } });
    }
    if (method === 'get' && path === 'user/notifications') {
      return ok(mockNotificationsPayload);
    }
    if (method === 'get' && path === 'user/get-unread-count') {
      const unread = mockNotificationsPayload.data.filter(n => !n.is_read).length;
      return ok({ data: { total: unread } });
    }
    if (method === 'post' && path.startsWith('user/mark-single-read/')) {
      return ok({ data: {} });
    }
    if (method === 'post' && path === 'user/mark-all-read') {
      return ok({ data: {} });
    }

    if (__DEV__) {
      console.warn(`[mock API] Unhandled ${method.toUpperCase()} ${path}`);
    }
    return ok({ message: `Mock: no handler for ${method} ${path}` }, 501);
  });
}
