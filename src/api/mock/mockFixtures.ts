/** Shapes align with `auth` slice and existing thunks (`response.data`, nested `data`). */

export const mockAuthUser = {
  id: 'mock-user-1',
  email: 'demo@rihaaish.test',
  firstname: 'Demo',
  lastname: 'User',
  image_url: '',
  mobile_no: '+10000000000',
  login_type: 'email',
  total_correct_answers: 0,
  push_notification: true,
  user_type: 'buyer',
  api_token: 'mock-api-token',
};

export const mockNotificationsPayload = {
  data: [
    {
      id: 'n1',
      title: 'Welcome',
      message: 'You are using the offline mock API.',
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'n2',
      title: 'Tip',
      message: 'Set api_urls.base_url in constants.ts to use the real backend.',
      is_read: true,
      created_at: new Date().toISOString(),
    },
  ],
  links: {},
};
