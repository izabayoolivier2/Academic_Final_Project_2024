import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot } from "firebase/firestore"; // Use onSnapshot
import { db } from "../../firebase/config";
import { Group } from "@/app/models/Group";
import { RootState } from "../store";
import { updateGroups, getGroupsError } from "./groupSlice";

export const getGroupsFromDB = createAsyncThunk(
  "group/getGroupsFromDB",
  (_, { dispatch }) => {
    const groupCollection = collection(db, "groups");

    // Use onSnapshot to listen for real-time changes
    const unsubscribe = onSnapshot(groupCollection, (snapshot) => {
      const groupList = snapshot.docs.map((doc) => {
        const data = doc.data() as Group;
        return {
          ...data,
          id: doc.id,
        };
      });

      // Dispatch an action to update the state with the real-time changes
      dispatch(updateGroups(groupList));
    });

    // Return the unsubscribe function to clean up the listener when needed
    return unsubscribe;
  }
);
