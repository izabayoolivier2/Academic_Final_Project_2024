import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
} from "firebase/auth";
import { auth, db } from "../../../firebase/config";
import {
  doc, 
  setDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { UserProps } from "../../../types/app.type";
import { setUser, updateLoggedInUser } from "./authSlice";
import { sendPasswordResetEmail } from "firebase/auth"

//user logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
});

//Google sign-in
export const googleSignIn = createAsyncThunk("auth/googleSignIn", async () => {
  const googleAuthProvider = new GoogleAuthProvider();
  await signInWithPopup(auth, googleAuthProvider);
});


// Email and password login
export const emailPasswordLogin = createAsyncThunk("auth/emailPasswordLogin", async ({ email, password }:{email:string, password:string}) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error) {
      return "Invalid Credentials"
    }
  }
});

// Function to save user profile data to Firestore
const saveUserProfileToDatabase = async (uid: string | undefined, email: string, names: string)  => {
  try {
    // Reference to the Firestore collection for user profiles
    const userCollection = collection(db, `users`);
    
    // Reference to the specific user document using their UID
    const userRef = doc(userCollection, uid);

    // Save the user's email, names, profile_url, and role to the Firestore document
    await setDoc(userRef, {
      email,
      names,
      profile_url: '',
      role: 'user',
      userId: uid,
    });
  } catch (error) {
    throw error;
  }
};

// Define the thunk action creator
export const updateUserProfileInDatabase = createAsyncThunk(
  'user/updateProfile',
  async (userData: any, { dispatch }) => {
    try {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userCollection = collection(db, 'users');
            const userRef = doc(userCollection, user.uid);
            // Update the user's profile data in the Firestore document
            await updateDoc(userRef, {...userData});
            dispatch(getUserByUserId(userData));
          }
        });
    } catch (error) {
      throw error;
    }
  }
);


// Email and password registration
export const emailPasswordRegistration = createAsyncThunk(
  "auth/emailPasswordRegistration",
  async ({ email, password, names}:{email: string, names: string, password: string}) => {
    try {
      // Register the user with Firebase authentication
      const userCredential: any = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save the user's email and names to Firestore
      const uid = userCredential.user.uid;

      await saveUserProfileToDatabase(uid, email, names);

      // Return the user's UID along with their email and names
      return { uid, email};
    } catch (error) {
      throw error;
    }
  }
);

export const getUserByUserId = createAsyncThunk(
  "user/getUserByUserId",
  async (userId: String, { dispatch }) => {
    try { 
      const userCollection = collection(db, "users");
      const userSnapshot = await getDocs(userCollection);
      const user = userSnapshot.docs
        .map((doc) => doc.data() as UserProps)
        .filter((user) => user.uid === userId); // Filter products by userId
      // Dispatch an action to update the state with the products by category ID
      dispatch(updateLoggedInUser(user));
    } catch (error) {
      // Handle errors
      console.error("User not found", error);
    }
  }
);

export const subscribeToUserProfile = createAsyncThunk(
  "user/subscribeToUserProfile",
  async (uid: string, { dispatch }) => {
    try { 
      const userRef = doc(collection(db, 'users'), uid);

      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          dispatch(setUser(userData)); // Dispatch the updated user data to Redux
        }
      });

      return unsubscribe; // Return the unsubscribe function for cleanup
    } catch (error) {
      // Handle errors
      console.error("User not found", error);
    }
  }
);

// reset password
export const PasswordResetEmail = createAsyncThunk(
  "auth/sendPasswordResetEmail",
  async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email).then((a) => {
        return "Password reset email sent";
      })
    } catch (error) {
      throw error;
    }
  }
);