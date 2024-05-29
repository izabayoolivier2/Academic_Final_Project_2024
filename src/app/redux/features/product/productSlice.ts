import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/app/models/Product";
import { ProductThunkProp } from "../../../types/app.type";


interface ProductState {
  products: Product[];
  product: any;
  error: string | null;
  productError: string | null;
}

const initialState: ProductState = {
  products: [],
  product: {},
  error: null,
  productError: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    getProductError(state, action: PayloadAction<string>) {
      state.productError = action.payload;
    },
    updateProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    product(state, action: PayloadAction<Product[]>) {
      state.product = action.payload;
    },
  },
});

export const {
  getProductError,
  updateProducts,
  product,
} = productSlice.actions;

export default productSlice.reducer;
