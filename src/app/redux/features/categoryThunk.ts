import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore"; // Use onSnapshot
import { db } from "../../firebase/config";
import { Category } from "@/app/models/Category";
import { RootState } from "../store";
import { setCakes, setCategories, setCars, setFood, setPhotos, setVenues } from "./categorySlice";
import { Cake } from '../../types/models';

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
      dispatch(setCategories(categoryList));
    });

    // Return the unsubscribe function to clean up the listener when needed
    return unsubscribe;
  }
);
export const getFood = createAsyncThunk(
  "category/getFood",
  (_, { dispatch }) => {
    const foodCollection = collection(db, "food");

    // Use onSnapshot to listen for real-time changes
    const unsubscribe = onSnapshot(foodCollection, (snapshot) => {
      const foodList = snapshot.docs.map((doc) => {
        const data = doc.data() as Cake;
        return {
          ...data,
          id: doc.id,
        };
      });

      // Dispatch an action to update the state with the real-time changes
      dispatch(setFood(foodList));
    });

    // Return the unsubscribe function to clean up the listener when needed
    return unsubscribe;
  }
);
export const getCars = createAsyncThunk(
  "category/getCars",
  (_, { dispatch }) => {
    const carCollection = collection(db, "cars");

    // Use onSnapshot to listen for real-time changes
    const unsubscribe = onSnapshot(carCollection, (snapshot) => {
      const carList = snapshot.docs.map((doc) => {
        const data = doc.data() as Cake;
        return {
          ...data,
          id: doc.id,
        };
      });

      // Dispatch an action to update the state with the real-time changes
      dispatch(setCars(carList));
    });

    // Return the unsubscribe function to clean up the listener when needed
    return unsubscribe;
  }
);
export const getVenues = createAsyncThunk(
  "category/getVenues",
  (_, { dispatch }) => {
    const venueCollection = collection(db, "venues");

    // Use onSnapshot to listen for real-time changes
    const unsubscribe = onSnapshot(venueCollection, (snapshot) => {
      const venueList = snapshot.docs.map((doc) => {
        const data = doc.data() as Cake;
        return {
          ...data,
          id: doc.id,
        };
      });

      // Dispatch an action to update the state with the real-time changes
      dispatch(setVenues(venueList));
    });

    // Return the unsubscribe function to clean up the listener when needed
    return unsubscribe;
  }
);
export const getCakes = createAsyncThunk(
  "category/getCakes",
  (_, { dispatch }) => {
    const cakeCollection = collection(db, "cakes");

    // Use onSnapshot to listen for real-time changes
    const unsubscribe = onSnapshot(cakeCollection, (snapshot) => {
      const cakeList = snapshot.docs.map((doc) => {
        const data = doc.data() as Cake;
        return {
          ...data,
          id: doc.id,
        };
      });

      // Dispatch an action to update the state with the real-time changes
      dispatch(setCakes(cakeList));
    });

    // Return the unsubscribe function to clean up the listener when needed
    return unsubscribe;
  }
);
export const getPhotos = createAsyncThunk(
  "category/getPhotos",
  (_, { dispatch }) => {
    const phoneCollection = collection(db, "photos");

    // Use onSnapshot to listen for real-time changes
    const unsubscribe = onSnapshot(phoneCollection, (snapshot) => {
      const phoneList = snapshot.docs.map((doc) => {
        const data = doc.data() as Cake;
        return {
          ...data,
          id: doc.id,
        };
      });

      // Dispatch an action to update the state with the real-time changes
      dispatch(setPhotos(phoneList));
    });

    // Return the unsubscribe function to clean up the listener when needed
    return unsubscribe;
  }
);

// Create an async thunk to store a product order
export const createCategory = createAsyncThunk(
  'service/createCategory',
  async (category: Cake ) => {
    try {
      // Reference to the Firestore collection for orders
      const categoriesCollection = collection(db, 'food');

      // Create a new order document
      const newCategoryDoc = doc(categoriesCollection);

      // Save the product order data to the Firestore document
      await setDoc(newCategoryDoc, category);

      // Return the newly created order ID (optional)
      return newCategoryDoc.id;
    } catch (error) {
      // Handle errors and return an error message (optional)
      return 'Error storing Service Category';
    }
  }
);
