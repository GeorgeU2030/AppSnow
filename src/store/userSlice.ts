import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: true,
    data: null,
  },
  reducers: {
    setUserLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setUserLoading, setUser } = userSlice.actions;

export default userSlice.reducer;