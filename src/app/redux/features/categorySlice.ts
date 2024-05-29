import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/app/models/Category";


interface CategoryState {
  categories: Category[];
  error: string | null;
  categoriesError: string | null;
}

const initialState: CategoryState = {
  categories: [],
  error: null,
  categoriesError: null,
};

const categorieslice = createSlice({
  name: "category",
  initialState,
  reducers: {
    getcategoriesError(state, action: PayloadAction<string>) {
      state.categoriesError = action.payload;
    },
    updatecategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
  },
});

export const {
  getcategoriesError,
  updatecategories,
} = categorieslice.actions;

export default categorieslice.reducer;
