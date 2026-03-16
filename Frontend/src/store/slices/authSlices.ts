import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  authorized: boolean;
  firstname: string | null;
}

const initialState: AuthState = {
  authorized: false,
  firstname: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{ authorized: boolean; firstname: string }>
    ) {
      state.authorized = action.payload.authorized;
      state.firstname = action.payload.firstname;
    },
    logout(state) {
      state.authorized = false;
      state.firstname = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;