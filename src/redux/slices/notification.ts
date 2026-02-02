import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getService, postService} from '../services';
import {api_urls} from '../../utilities';

const initialState = {
  unreadCount: 0,
  notifications: {
    data: [],
    links: {},
  } as any,
};

export const getNotifications = createAsyncThunk(
  'getNotifications',
  async (params: any, {}) => {
    try {
      const response = await getService(api_urls.notifications.get, params);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const loadMoreNotifications = createAsyncThunk(
  'loadMoreNotifications',
  async (params: any, {}) => {
    try {
      const response = await getService(api_urls.notifications.get, params);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const getUnreadNotificationsCount = createAsyncThunk(
  'getUnreadNotificationsCount',
  async (params: any, {}) => {
    try {
      const response = await getService(
        api_urls.notifications.unreadCount,
        params,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
);

export const markReadNotification = createAsyncThunk(
  'markReadNotification',
  async (_id: any, {dispatch}) => {
    try {
      const response = await postService(
        `${api_urls.notifications.markRead}/${_id}`,
      );
      dispatch(onMarkReadSuccess({id: _id}));
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
);

export const markAllAsRead = createAsyncThunk(
  'markAllAsRead',
  async (data: any, {}) => {
    try {
      const response = await postService(
        api_urls.notifications.markAllRead,
        data,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
);

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    onMarkReadSuccess: (state, action) => {
      const temp = [...state.notifications.data];
      const index = temp.findIndex(i => i.id == action.payload.id);
      temp[index].is_read = true;

      if (state.unreadCount > 0) {
        state.unreadCount = state.unreadCount - 1;
      }
      state.notifications.data = temp;
    },
  },
  extraReducers: builder => {
    builder.addCase(getNotifications.fulfilled, (state, {payload}) => {
      state.notifications = payload;
    });
    builder.addCase(loadMoreNotifications.fulfilled, (state, {payload}) => {
      state.notifications.data = [...state.notifications.data, ...payload.data];
      state.notifications.links = payload.links;
    });
    builder.addCase(
      getUnreadNotificationsCount.fulfilled,
      (state, {payload}) => {
        state.unreadCount = payload.total;
      },
    );
    builder.addCase(markAllAsRead.fulfilled, (state, {payload}) => {
      state.unreadCount = 0;
    });
  },
});

export const {onMarkReadSuccess} = notificationSlice.actions;
export default notificationSlice.reducer;
