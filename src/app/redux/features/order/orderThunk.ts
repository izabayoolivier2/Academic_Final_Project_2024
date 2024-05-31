import { auth, db } from "../../../firebase/config";
import {
  collection,
  getDocs,
  doc, setDoc,
  onSnapshot
} from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setOrders } from "./orderSlice";
import { Order } from "@/app/types/models";

// Create an async thunk to store a product order
export const storeOrder = createAsyncThunk(
  'orders/createOrder',
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
      return 'Error storing the order';
    }
  }
);


export const getOrdersFromDB = createAsyncThunk(
  "order/getOrdersFromDB",
  (_, { dispatch }) => {
    const orderCollection = collection(db, "orders");

    // Use onSnapshot to listen for real-time changes
    const unsubscribe = onSnapshot(orderCollection, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => {
        const data = doc.data() as Order;
        return {
          ...data,
          id: doc.id,
        };
      });

      // Dispatch an action to update the state with the real-time changes
      dispatch(setOrders(orderList));
    });

    // Return the unsubscribe function to clean up the listener when needed
    return unsubscribe;
  }
);
