import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setToken(state, value) {
      state.token = value.payload;
    },
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    clearAuthState: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setToken, setSignupData, setLoading,clearAuthState } = authSlice.actions;
export default authSlice.reducer;
