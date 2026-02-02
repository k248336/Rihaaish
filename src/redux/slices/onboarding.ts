import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface OnboardingState {
  hasSeenOnboarding: boolean;
}

const initialState: OnboardingState = {
  hasSeenOnboarding: false,
};
const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingComplete: (state) => {
      state.hasSeenOnboarding = true;
    },
    resetOnboarding: (state) => {
      state.hasSeenOnboarding = false;
    },
  },
});

export const {setOnboardingComplete, resetOnboarding} = onboardingSlice.actions;
export default onboardingSlice.reducer;
