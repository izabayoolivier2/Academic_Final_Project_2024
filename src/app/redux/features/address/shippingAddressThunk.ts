import { db } from "../../../firebase/config";
import {
  addDoc,
  collection,
  doc, getDocs, onSnapshot, query, setDoc, updateDoc, where
} from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAddress } from "./shippingAddressSlice";
import  ShippingAddress  from "@/app/models/Address";

export const createUserAddress = createAsyncThunk(
  'addresses/userAddress',
  async (address: any) => {
    try {
      const addressesCollection = collection(db, 'addresses');
      const querySnapshot = await getDocs(addressesCollection);

      let existingAddressId = '';
      let existingAddress: any = null;

      // Loop through the query snapshot to find existing addresses with the same address type
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.addressType === address.addressType) {
          existingAddressId = doc.id;
          existingAddress = data;
        }
      });

      if (existingAddress) {
        // If an existing address is found, update it with the new address data
        const existingAddressRef = doc(addressesCollection, existingAddressId);
        await updateDoc(existingAddressRef, address);
        return existingAddressId;
      } else {
        // If no existing address is found, create a new address document
        const newAddressDoc = await addDoc(addressesCollection, address);
        return newAddressDoc.id;
      }
    } catch (error) {
      console.error('Error storing user address:', error);
      // Handle errors and return an error message (optional)
      return 'Error storing user address';
    }
  }
);

export const subscribeToUserAddress = createAsyncThunk(
    "user/subscribeToUserAddress",
    async (uid: string, { dispatch }) => {
      try { 
      // Create a query that filters addresses based on the 'owner' field
      const addressesQuery = query(
        collection(db, 'addresses'),
        where('owner', '==', uid) // Match addresses with 'owner' equal to 'uid'
      );
  
      const unsubscribe = onSnapshot(addressesQuery, (querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
          if (docSnapshot.exists()) {
            const addressData = docSnapshot.data();
            dispatch(setAddress(addressData as ShippingAddress));
          }
        });
      });

      return unsubscribe;
      } catch (error) {
        // Handle errors
        console.error("User not found", error);
      }
    }
  );
