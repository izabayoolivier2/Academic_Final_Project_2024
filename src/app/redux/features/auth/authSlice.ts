import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProps } from "@/app/types/app.type";

interface UserState {
  error: string | null;
  user: UserProps | null;
  loggedInUser: UserProps[] | null;
}

const initialState: UserState = {
  error: null,
  user: null,
  loggedInUser: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    updateLoggedInUser(state, action: PayloadAction<UserProps[]>) {
      state.loggedInUser = action.payload;
    },
  },
});

export const {
  setUser,
  updateLoggedInUser,
} = authSlice.actions;

export default authSlice.reducer;
