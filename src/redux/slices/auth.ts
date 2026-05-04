import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api_urls } from '../../utilities';
import {
  getService,
  postService,
  postFormDataService,
  patchFormDataService,
  patchService,
  deleteService,
} from '../services';
import { RootState } from '../store';

const initialState = {
  accessToken: '',
  refreshToken: '',
  userInfo: {
    id: '',
    email: '',
    firstname: '',
    lastname: '',
    image_url: '',
    mobile_no: '',
    login_type: '',
    total_correct_answers: 0,
    push_notification: false,
    user_type: '',
    date_of_birth: '',
    bio: '',
  },
  email: '',
  password: '',
  // staticPages: [],
  // faqs: [] as any,
  checked: false,
};

/** Maps GET /api/v1/profile/ `data` object into `userInfo` shape */
export function mapProfileToUserInfo(raw: any) {
  if (!raw || typeof raw !== 'object') {
    return { ...initialState.userInfo };
  }
  // Full API envelope: unwrap once { status, message, data: { id, profile, ... } }
  if (
    raw.data &&
    typeof raw.data === 'object' &&
    raw.profile === undefined &&
    (raw.data as any).email != null &&
    (raw.data as any).id != null
  ) {
    return mapProfileToUserInfo(raw.data);
  }
  const prof = raw.profile as Record<string, unknown> | undefined;
  // API nests avatar + phone under `profile` (e.g. avatar_url, phone)
  const imageUrl =
    (prof?.avatar_url as string) ||
    (prof?.avatar as string) ||
    (prof?.image as string) ||
    (raw.image_url as string) ||
    (raw.avatar_url as string) ||
    (raw.avatar as string) ||
    '';
  const mobile =
    (prof?.phone as string) ||
    (raw.phone as string) ||
    (raw.mobile_no as string) ||
    '';
  const dob =
    (prof?.date_of_birth as string) ??
    (raw as any).date_of_birth ??
    (raw as any).dob ??
    '';
  return {
    id: raw.id != null ? String(raw.id) : '',
    email: String(raw.email ?? ''),
    firstname: String(raw.first_name ?? raw.firstname ?? ''),
    lastname: String(raw.last_name ?? raw.lastname ?? ''),
    image_url: imageUrl,
    mobile_no: String(mobile),
    login_type: String(raw.login_type ?? ''),
    total_correct_answers: Number(raw.total_correct_answers ?? 0),
    push_notification: Boolean(raw.push_notification ?? false),
    user_type: String(raw.user_type ?? ''),
    bio: String(prof?.bio ?? (raw as any).bio ?? ''),
    date_of_birth: String(dob),
  };
}

function applyLoginPayload(state: typeof initialState, payload: any) {
  if (!payload) {
    return;
  }
  const wrapped = payload as Record<string, unknown>;
  const data = wrapped.data as Record<string, unknown> | undefined;
  const root = (data ?? wrapped) as Record<string, unknown>;
  const tokens = root.tokens as Record<string, unknown> | undefined;

  const rawToken =
    (tokens?.access as string | undefined) ??
    (root.access as string | undefined) ??
    (wrapped.access as string | undefined) ??
    (root.api_token as string | undefined) ??
    (wrapped.api_token as string | undefined);

  if (rawToken) {
    state.accessToken = rawToken.startsWith('Bearer ')
      ? rawToken
      : `Bearer ${rawToken}`;
  }

  const rawRefresh =
    (tokens?.refresh as string | undefined) ??
    (root.refresh as string | undefined) ??
    (wrapped.refresh as string | undefined);
  if (rawRefresh) {
    state.refreshToken = rawRefresh;
  }

  const userObj =
    (root.user as Record<string, unknown> | undefined) ??
    (wrapped.user as Record<string, unknown> | undefined) ??
    (data && (root.email != null || root.id != null) ? root : undefined);

  if (userObj && typeof userObj === 'object') {
    const id = userObj.id ?? userObj.pk;
    const nested = userObj.profile as Record<string, unknown> | undefined;
    state.userInfo = {
      ...state.userInfo,
      id: id != null ? String(id) : state.userInfo.id,
      email: (userObj.email as string) ?? state.userInfo.email,
      firstname:
        (userObj.firstname as string) ??
        (userObj.first_name as string) ??
        state.userInfo.firstname,
      lastname:
        (userObj.lastname as string) ??
        (userObj.last_name as string) ??
        state.userInfo.lastname,
      image_url:
        (nested?.avatar_url as string) ||
        (userObj.image_url as string) ||
        (userObj.avatar_url as string) ||
        (userObj.avatar as string) ||
        state.userInfo.image_url,
      mobile_no:
        (nested?.phone as string) ||
        (userObj.mobile_no as string) ||
        (userObj.phone as string) ||
        state.userInfo.mobile_no,
      bio: String(nested?.bio ?? (userObj as any).bio ?? state.userInfo.bio),
      date_of_birth: String(
        (nested?.date_of_birth as string) ??
          (userObj as any).date_of_birth ??
          (userObj as any).dob ??
          state.userInfo.date_of_birth,
      ),
      login_type: (userObj.login_type as string) ?? state.userInfo.login_type,
      user_type: (userObj.user_type as string) ?? state.userInfo.user_type,
    };
  }
}

export const selectSavedCredentials = (state: RootState) => ({
  email: state.auth.email,
  password: state.auth.password,
  checked: state.auth.checked,
});
const logLogin = (label: string, payload: unknown) => {
  try {
    console.log(`[Rihaish][login] ${label}:`, JSON.stringify(payload, null, 2));
  } catch {
    console.log(`[Rihaish][login] ${label}:`, payload);
  }
};

export const login = createAsyncThunk(
  'login',
  async (data: any, { rejectWithValue }) => {
    try {
      logLogin('request body (password redacted)', {
        ...data,
        password: data?.password ? '***' : undefined,
      });
      // Suppress global error toast; Login screen uses its own bottom modal
      const response = await postService(api_urls.login, data, false);
      logLogin('response.data (full)', response?.data);
      logLogin('HTTP status', response?.status);
      return response.data;
    } catch (error: any) {
      // postService throws axios `error.response` (has .status, .data)
      const body = error?.data ?? error?.response?.data;
      logLogin('error (full)', {
        status: error?.status ?? error?.response?.status,
        data: body,
        message: error?.message ?? error?.response?.message,
      });
      return rejectWithValue(body);
    }
  },
);

export const sociaLogin = createAsyncThunk('login', async (data: any, {}) => {
  try {
    const response = await postService(api_urls.sociaLogin, data, false);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const signup = createAsyncThunk(
  'signup',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await postFormDataService(api_urls.signup, formData);
      return response.data;
    } catch (error: any) {
      // const body = error?.data ?? error?.response?.data;
      return rejectWithValue(error);
    }
  },
);

const logGetProfile = (label: string, payload: unknown) => {
  try {
    console.log(
      `[Rihaish][getProfile] ${label}:`,
      JSON.stringify(payload, null, 2),
    );
  } catch {
    console.log(`[Rihaish][getProfile] ${label}:`, payload);
  }
};

export const getProfile = createAsyncThunk(
  'getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getService(api_urls.profileGet);
      const body = response?.data as Record<string, unknown> | undefined;
      logGetProfile('response.data (full body)', body);
      // Postman: { status, message, data: { id, email, profile: { avatar_url, phone } } }
      const profilePayload =
        body?.data ?? (body?.id != null || body?.profile ? body : undefined);
      logGetProfile('profilePayload (mapped input)', profilePayload);
      logGetProfile('HTTP status', response?.status);
      return profilePayload;
    } catch (error: any) {
      const body = error?.data ?? error?.response?.data;
      logGetProfile('error', {
        status: error?.status ?? error?.response?.status,
        data: body,
        message: error?.message,
      });
      return rejectWithValue(body);
    }
  },
);

export const updateProfile = createAsyncThunk(
  'updateProfile',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await patchFormDataService(
        api_urls.profileUpdate,
        formData,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.data ?? error?.response?.data ?? error);
    }
  },
);

export const updloadAttachment = async (data: any) => {
  try {
    const response = await postService(api_urls.uploadAttachment, data, true, {
      'Content-Type': 'multipart/form-data',
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const sendOtp = createAsyncThunk('sendOtp', async (data: any, {}) => {
  try {
    const response = await postService(api_urls.sendOtp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const verifyOtpRegister = createAsyncThunk(
  'verifyOtpRegister',
  async (data: any, {}) => {
    try {
      const response = await postService(api_urls.verifyOtpRegister, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const verifyOtpForgotPass = createAsyncThunk(
  'verifyOtpForgotPass',
  async (data: any, {}) => {
    try {
      const response = await postService(api_urls.verifyOtpForgotPass, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const resetPassword = createAsyncThunk(
  'resetPassword',
  async (data: any, {}) => {
    try {
      const response = await postService(api_urls.resetPassword, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const changePassword = createAsyncThunk(
  'changePassword',
  async (
    data: { old_password: string; new_password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await postService(api_urls.authChangePassword, data, true, {
        'Content-Type': 'application/json',
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.data ?? error?.response?.data ?? error);
    }
  },
);

export const logout = createAsyncThunk(
  'logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const refresh = (getState() as RootState).auth.refreshToken;
      const body = refresh ? { refresh } : {};
      const response = await postService(api_urls.logout, body, false, {
        'Content-Type': 'application/json',
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.data ?? error?.response?.data ?? error);
    }
  },
);

export const deleteAccount = createAsyncThunk(
  'deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await deleteService(api_urls.authDeleteAccount);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.data ?? error?.response?.data ?? error);
    }
  },
);

export const updateNotiStatus = createAsyncThunk(
  'updateNotiStatus',
  async (params: any, {}) => {
    try {
      const response = await postService(api_urls.toggleNotification, params);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    removeAccessToken: (state, action) => {
      state.accessToken = '';
      state.refreshToken = '';
    },
    clearSession: state => {
      state.accessToken = '';
      state.refreshToken = '';
      state.userInfo = {
        id: '',
        email: '',
        firstname: '',
        lastname: '',
        image_url: '',
        mobile_no: '',
        login_type: '',
        total_correct_answers: 0,
        push_notification: false,
        user_type: '',
        date_of_birth: '',
        bio: '',
      };
    },
    saveUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    saveUserRole: (state, action) => {
      state.userInfo.user_type = action.payload;
    },
    saveUserPreferences: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        preferences: action.payload,
      } as any;
    },
    setCredentials: (state, { payload }) => {
      // console.log('payload: ', payload);
      state.email = payload?.email;
      state.password = payload?.password;
      state.checked = payload?.checked;
    },
  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, { payload }) => {
      applyLoginPayload(state, payload);
    });
    builder.addCase(signup.fulfilled, (state, { payload }) => {
      applyLoginPayload(state, payload);
    });
    builder.addCase(verifyOtpRegister.fulfilled, (state, { payload }) => {
      state.accessToken = 'Bearer ' + payload?.data?.api_token;
      state.userInfo = payload?.data;
    });

    builder.addCase(verifyOtpForgotPass.fulfilled, (state, { payload }) => {
      state.accessToken = 'Bearer ' + payload?.data?.api_token;
    });
    builder.addCase(updateProfile.fulfilled, (state, { payload }) => {
      const raw = (payload as any)?.data ?? payload;
      if (raw && typeof raw === 'object') {
        state.userInfo = {
          ...state.userInfo,
          ...mapProfileToUserInfo(raw),
        };
      }
    });
    builder.addCase(getProfile.fulfilled, (state, { payload }) => {
      state.userInfo = {
        ...state.userInfo,
        ...mapProfileToUserInfo(payload),
      };
    });
    builder.addCase(updateNotiStatus.fulfilled, (state, { payload }) => {
      state.userInfo = {
        ...state.userInfo,
        push_notification: !state?.userInfo?.push_notification,
      };
    });
    builder.addCase(logout.fulfilled, (state, { payload }) => {
      state.accessToken = '';
      state.refreshToken = '';
      state.userInfo = {
        id: '',
        email: '',
        firstname: '',
        lastname: '',
        image_url: '',
        mobile_no: '',
        login_type: '',
        total_correct_answers: 0,
        push_notification: false,
        user_type: '',
        date_of_birth: '',
        bio: '',
      };
    });
    builder.addCase(deleteAccount.fulfilled, (state, { payload }) => {
      state.accessToken = '';
      state.refreshToken = '';
      state.userInfo = {
        id: '',
        email: '',
        firstname: '',
        lastname: '',
        image_url: '',
        mobile_no: '',
        login_type: '',
        total_correct_answers: 0,
        push_notification: false,
        user_type: '',
        date_of_birth: '',
        bio: '',
      };
    });
    // builder.addCase(customerService.fulfilled, (state, {payload}) => {
    //   state.customerService = payload;
    // });
    // builder.addCase(getPageUrls.fulfilled, (state, {payload}) => {
    //   state.pageUrls = payload;
    // });
  },
});

export const {
  saveUserInfo,
  saveAccessToken,
  removeAccessToken,
  clearSession,
  saveUserRole,
  saveUserPreferences,
  setCredentials,

} = authSlice.actions;
export default authSlice.reducer;
