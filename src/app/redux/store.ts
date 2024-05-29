import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import authReducer from "./features/auth/authSlice";
import productReducer from "./features/product/productSlice";
import categoryReducer from "./features/categorySlice";
import shippingAddressReducer from "./features/address/shippingAddressSlice";
import groupReducer from "./features/groupSlice";
import {contentReducer} from "./features/search";
// import {addressReducer} from "./features/address";
import walletReducer from "./features/wallet/walletSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    auth: authReducer,
    category: categoryReducer,
    group: groupReducer,
    search: contentReducer,
    // address: addressReducer,
    wallet: walletReducer,
    shippingAddress: shippingAddressReducer

  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
