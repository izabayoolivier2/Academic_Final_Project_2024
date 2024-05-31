import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/app/models/Category";
import { Cake } from "@/app/types/models";


interface CategoryState {
  categories: Category[];
  cakes: Cake[];
  cars: Cake[];
  venues: Cake[];
  food: Cake[];
  photos: Cake[];
  error: string | null;
  categoriesError: string | null;
}

const initialState: CategoryState = {
  categories: [],
  cakes: [],
  cars: [],
  venues: [],
  food: [],
  photos: [],
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
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
    setCars(state, action: PayloadAction<Cake[]>) {
      state.cars = action.payload;
    },
    setCakes(state, action: PayloadAction<Cake[]>) {
      state.cakes = action.payload;
    },
    setPhotos(state, action: PayloadAction<Cake[]>) {
      state.photos = action.payload;
    },
    setFood(state, action: PayloadAction<Cake[]>) {
      state.food = action.payload;
    },
    setVenues(state, action: PayloadAction<Cake[]>) {
      state.venues = action.payload;
    },
  },
});

export const {
  getcategoriesError,
  setCars,
  setCakes,
  setPhotos,
  setFood,
  setCategories,
  setVenues,
} = categorieslice.actions;

export default categorieslice.reducer;
