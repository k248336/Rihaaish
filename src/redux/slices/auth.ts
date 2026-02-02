import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api_urls } from '../../utilities';
import {
  getService,
  postService,
  patchService,
  deleteService,
} from '../services';
import { RootState } from '../store';

const initialState = {
  accessToken: '',
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
  },
  email: '',
  password: '',
  // staticPages: [],
  // faqs: [] as any,
  checked: false,
};
export const selectSavedCredentials = (state: RootState) => ({
  email: state.auth.email,
  password: state.auth.password,
  checked: state.auth.checked,
});
export const login = createAsyncThunk(
  'login',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await postService(api_urls.login, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.data);
    }
  },
);

export const sociaLogin = createAsyncThunk('login', async (data: any, {}) => {
  try {
    const response = await postService(api_urls.sociaLogin, data);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const signup = createAsyncThunk(
  'signup',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await postService(api_urls.user, data, true, {
        // 'content-type': 'multipart/form-data',
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.data);
    }
  },
);

export const getProfile = createAsyncThunk(
  'getProfile',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await getService(api_urls.user);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.data);
    }
  },
);

export const updateProfile = createAsyncThunk(
  'updateProfile',
  async (data: any, {}) => {
    try {
      const response = await patchService(api_urls.user, data);
      return response.data.data;
    } catch (error) {
      throw error;
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
  async (data: any, {}) => {
    try {
      const response = await postService(api_urls.changePassword, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const logout = createAsyncThunk('logout', async (data: any, {}) => {
  try {
    const response = await postService(api_urls.logout, data, false);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const deleteAccount = createAsyncThunk('deleteAccount', async () => {
  try {
    const response = await deleteService(api_urls.user);
    return response.data;
  } catch (error) {
    throw error;
  }
});

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
      state.accessToken = 'Bearer ' + payload?.data?.api_token;
      state.userInfo = payload?.data;
    });
    builder.addCase(verifyOtpRegister.fulfilled, (state, { payload }) => {
      state.accessToken = 'Bearer ' + payload?.data?.api_token;
      state.userInfo = payload?.data;
    });

    builder.addCase(verifyOtpForgotPass.fulfilled, (state, { payload }) => {
      state.accessToken = 'Bearer ' + payload?.data?.api_token;
    });
    builder.addCase(updateProfile.fulfilled, (state, { payload }) => {
      state.userInfo = payload;
    });
    builder.addCase(getProfile.fulfilled, (state, { payload }) => {
      state.userInfo = payload;
    });
    builder.addCase(updateNotiStatus.fulfilled, (state, { payload }) => {
      state.userInfo = {
        ...state.userInfo,
        push_notification: !state?.userInfo?.push_notification,
      };
    });
    builder.addCase(logout.fulfilled, (state, { payload }) => {
      state.accessToken = '';
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
      };
    });
    builder.addCase(deleteAccount.fulfilled, (state, { payload }) => {
      state.accessToken = '';
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
  saveUserRole,
  saveUserPreferences,
  setCredentials,

} = authSlice.actions;
export default authSlice.reducer;
