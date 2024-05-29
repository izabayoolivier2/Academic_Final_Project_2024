import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WalletProp } from "@/app/types/app.type";

interface WalletState {
  error: string | null;
  wallet: WalletProp | null;
}

const initialState: WalletState = {
  error: null,
  wallet: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet(state, action) {
      state.wallet = action.payload;
    }
  },
});

export const {
  setWallet
} = walletSlice.actions;

export default walletSlice.reducer;