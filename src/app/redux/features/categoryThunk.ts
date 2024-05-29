import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot } from "firebase/firestore"; // Use onSnapshot
import { db } from "../../firebase/config";
import { Category } from "@/app/models/Category";
import { RootState } from "../store";
import { updatecategories, getcategoriesError } from "./categorySlice";

export const getCategoriesFromDB = createAsyncThunk(
  "category/getCategoriesFromDB",
  (_, { dispatch }) => {
    const categoryCollection = collection(db, "categories");

    // Use onSnapshot to listen for real-time changes
    const unsubscribe = onSnapshot(categoryCollection, (snapshot) => {
      const categoryList = snapshot.docs.map((doc) => {
        const data = doc.data() as Category;
        return {
          ...data,
          id: doc.id,
        };
      });

      // Dispatch an action to update the state with the real-time changes
      dispatch(updatecategories(categoryList));
    });

    // Return the unsubscribe function to clean up the listener when needed
    return unsubscribe;
  }
);
