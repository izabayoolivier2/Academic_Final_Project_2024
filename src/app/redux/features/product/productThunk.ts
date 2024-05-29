import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  onSnapshot,
  where,
  query,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "@/app/firebase/config";

import { Product } from "@/app/models/Product";
import { ProductThunkProp } from "../../../types/app.type";
import {
  getProductError,
  updateProducts,
  product
} from "./productSlice";

export const getProductsFromDB = createAsyncThunk(
  "product/getProductsFromDB",
  async (_, { dispatch }) => {
    try {
      const productCollection = collection(db, "products");

      // Set up a real-time listener for the product collection
      const unsubscribe = onSnapshot(productCollection, (snapshot) => {
        const productList = snapshot.docs.map((doc: any) => ({
          id: doc.id, // Add the document ID to each product object
          ...doc.data(),
        })) as Product[];

        // Dispatch an action to update the products in Redux store
        dispatch(updateProducts(productList));
      });

      // Return the unsubscribe function to clean up the listener when needed
      return unsubscribe;
    } catch (error: any) {
      console.error("Error fetching products:", error);
      dispatch(
        getProductError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        )
      );
      throw error; // Rethrow the error to let the caller handle it
    }
  }
);


export const getProductsByCategoryId = createAsyncThunk(
  "product/getProductsByCategoryId",
  async (categoryId: String, { dispatch }) => {
    try { 
      const productCollection = collection(db, "products");
      const productSnapshot = await getDocs(productCollection);
      const productList = productSnapshot.docs
        .map((doc) => doc.data() as Product)
        .filter((product) => product.category_id === categoryId); // Filter products by categoryId
      // Dispatch an action to update the state with the products by category ID
      dispatch(updateProducts(productList));
    } catch (error) {
      // Handle errors
      console.error("Error fetching products by category:", error);
    }
  }
);

export const likeProduct = createAsyncThunk(
  "product/likeProduct",
  async (product: any) => {
    try { 
      const productCollection = collection(db, "products");
      const documentRef = doc(productCollection, product.id);
      await updateDoc(documentRef, product)
    } catch (error) {
      // Handle errors
      console.error("Error fetching products by category:", error);
    }
  }
);
