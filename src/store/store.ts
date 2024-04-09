import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export interface RootState {
  user: {
    loading: boolean;
    data: {
      name: string;
      email: string;
      imageProfile: string;
    } | null;
  };
}

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;