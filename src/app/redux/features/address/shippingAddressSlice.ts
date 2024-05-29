import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the shipping address
interface ShippingAddress {
  owner: string; // User ID
  address: string;
  apartment: string;
  city: string;
  country: string;
  province: string;
  postalCode: string;
  addressType: "home" | "office";
}

interface ShippingAddressState {
  error: string | null;
  address: ShippingAddress | null;
}

const initialState: ShippingAddressState = {
  error: null,
  address: null
}

const shippingAddressSlice = createSlice({
  name: "shippingAddress",
  initialState,
  reducers: {
    setAddress(state, action: PayloadAction<ShippingAddress>) {
      state.address = action.payload;
    },
  },
})

export const {
  setAddress,
} = shippingAddressSlice.actions;

export default shippingAddressSlice.reducer;
