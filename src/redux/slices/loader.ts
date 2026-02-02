import {createSlice} from '@reduxjs/toolkit';

export const loaderSlice = createSlice({
  name: 'loader',
  initialState: {isVisible: false},
  reducers: {
    showLoader: state => {
      state.isVisible = true;
    },
    hideLoader: state => {
      state.isVisible = false;
    },
  },
});

export const {showLoader, hideLoader} = loaderSlice.actions;
export default loaderSlice.reducer;
