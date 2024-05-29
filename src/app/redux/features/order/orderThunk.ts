import { auth, db } from "../../../firebase/config";
import {
  collection,
  getDocs,
  doc, setDoc
} from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Create an async thunk to store a product order
export const storeProductOrder = createAsyncThunk(
  'orders/storeProductOrder',
  async (order:any) => {
    try {
      // Reference to the Firestore collection for orders
      const ordersCollection = collection(db, 'orders');

      // Create a new order document
      const newOrderDoc = doc(ordersCollection);

      // Save the product order data to the Firestore document
      await setDoc(newOrderDoc, order);

      // Return the newly created order ID (optional)
      return newOrderDoc.id;
    } catch (error) {
      // Handle errors and return an error message (optional)
      return 'Error storing product order';
    }
  }
);
