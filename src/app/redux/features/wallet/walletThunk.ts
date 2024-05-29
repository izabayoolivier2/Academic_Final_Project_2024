import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    collection,
    getDocs,
    onSnapshot,
    updateDoc,
    doc
  } from "firebase/firestore";
  import { db } from "../../../firebase/config";
  import {
    setWallet
  } from "./walletSlice";
import { WalletProp } from "../../../types/app.type";


export const getWalletByUserId = createAsyncThunk(
  "user/getWalletByUserId",
  async (userId: String, { dispatch }) => {
    try { 
      const walletCollection = collection(db, "wallets");
      const walletSnapshot = await getDocs(walletCollection);
      const wallet = walletSnapshot.docs
        .map((doc) => doc.data() as WalletProp)
        .filter((wallet) => wallet.userId === userId);
      return dispatch(setWallet(wallet));
    } catch (error) {
      // Handle errors
      console.error("Wallet not found", error);
    }
  }
);

export const deductWalletPoints = createAsyncThunk(
  "user/deductWalletPoints",
  async ({ userId, points }:{userId: string, points:number}, { dispatch }) => {
    try {
      const walletCollection = collection(db, "wallets");
      const walletQuery = await getDocs(walletCollection);
      const walletDoc = walletQuery.docs.find(
        (doc) => doc.data().userId === userId
      );

      if (!walletDoc) {
        // Handle the case where the user's wallet document is not found
        console.error("Wallet not found");
        return;
      }

      const walletData = walletDoc.data();
      const updatedPoints = walletData.points - points;

      // Update the wallet document with the deducted points
      await updateDoc(doc(walletCollection, walletDoc.id), {
        points: updatedPoints,
      });

      // Dispatch the updated wallet to Redux
      dispatch(setWallet({ ...walletData, points: updatedPoints }));
      return true
    } catch (error) {
      // Handle errors
      console.error("Error deducting points", error);
      return false
    }
  }
);