import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  query,
  getDocs,
  where,
  updateDoc,
} from 'firebase/firestore';
import { addToCart, removeFromCart, setCartItems } from './cartSlice';
import { db, auth } from '@/app/firebase/config';
import { CartItem } from '@/app/models/Cart';

import { onAuthStateChanged } from 'firebase/auth';
import { getUserByUserId } from '../auth/authThunk';

export const listenToCartUpdates = createAsyncThunk(
  'cart/listenToCartUpdates',
  async (_, { dispatch }) => {
    try {
      let userId: string
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          dispatch(getUserByUserId(user.uid));
          userId = user.uid
          const cartCollection = collection(db, 'cart');
          const cartQuery = query(cartCollection, where('owner', '==', userId));
          
          const unsubscribe = onSnapshot(cartQuery, (snapshot) => {
            const cartItems = snapshot.docs.map((doc) => doc.data());
            dispatch(setCartItems({...cartItems[0]} as any));
          });

          const cartSnapshot = await getDocs(cartQuery);
          const cartDocs = cartSnapshot.docs;

          let cartItems = {}

          const cartItemsFromLocalStorage = localStorage.getItem('cartItems');
          if (cartDocs[0].exists()) {
            if (cartItemsFromLocalStorage) {
              cartItems = JSON.parse(cartItemsFromLocalStorage);
              const updatedCart = {
                ...cartDocs[0].data(),
                ...cartItems,
                owner: userId
              }
              await updateDoc(cartDocs[0].ref, updatedCart)
            }
          } 

          if (cartItemsFromLocalStorage) {
            const cartItems = JSON.parse(cartItemsFromLocalStorage);
            dispatch(setCartItems(cartItems));
            await addDoc(cartCollection, cartItems)
        }
          return unsubscribe;
        } else {
          const cartItemsFromLocalStorage = localStorage.getItem('cartItems');
          if (cartItemsFromLocalStorage) {
            const cartItems = JSON.parse(cartItemsFromLocalStorage);
            dispatch(setCartItems(cartItems));
        }
      }})

      const cartItemsFromLocalStorage = localStorage.getItem('cartItems');
      if (cartItemsFromLocalStorage) {
        const cartItems = JSON.parse(cartItemsFromLocalStorage);
        dispatch(addToCart(cartItems));
    }
      
    } catch (error) {
      console.error('Error listening to cart updates:', error);
      throw error;
    }
  }
);

export const addToCartFirestore = createAsyncThunk(
  'cart/addToCartFirestore',
  async (cartItem: any, { dispatch }) => {
    try {
      const userId = cartItem.owner;
      const productId = cartItem.products[0].productId;

      if(userId !== "" && productId !== null && userId !== undefined) {
        // Query for the user's cart items
        const cartCollection = collection(db, 'cart');
        const cartQuery = query(cartCollection, where('owner', '==', userId));
        const cartSnapshot = await getDocs(cartQuery);
        const cartDocs = cartSnapshot.docs;

        if(cartDocs.length !== 0){
          // Check if the product already exists in the cart
          const existingCartItemDoc = cartDocs.find((doc) => {
            const cartData = doc.data()
            return cartData.products.some((product: any) => product.productId === productId);
          });
          
          if (existingCartItemDoc?.exists()) {
            // If the product already exists, update its quantity
            const existingCartItemData = existingCartItemDoc.data();
            const updatedProducts = existingCartItemData.products.map((product: any) => {
              if (product.productId === productId) {
                return {
                  ...product,
                  quantity: product.quantity + cartItem.products[0].quantity,
                };
              }
              return product;
            });
            
            await updateDoc(existingCartItemDoc.ref, {
              products: updatedProducts,
            })
          } else {
            
            // If the product is not in the cart, add it to the existing cart
            const existingCart = cartDocs[0]?.data();
            if(existingCart){
  
            }
            const updatedCart = {
              ...existingCart,
              products: [...existingCart?.products, cartItem?.products[0]],
            };
            
            await updateDoc(cartDocs[0].ref, updatedCart);
          }
        } else{
          await addDoc(cartCollection, cartItem);
        }
        

        // After updating Firestore, update Local Storage
        const existingCartItems = localStorage.getItem('cartItems');
        let cartItems = existingCartItems ? JSON.parse(existingCartItems) : {};
        
        if(cartItems.products?.length > 0) {
          const existingCartItem = cartItems.products.find(
            (item: any) => item.productId === productId
            );
            if (existingCartItem) {
              existingCartItem.quantity += cartItem.products[0].quantity;
            } else {
              cartItems.products = [...cartItems.products, cartItem.products[0]];
            }
            localStorage.removeItem('cartItems')
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
          }else{
            // Update Local Storage with the updated cartItems
          cartItems =cartItem
          localStorage.removeItem('cartItems')
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
      } else {
        // After updating Firestore, update Local Storage
        const existingCartItems = localStorage.getItem('cartItems');
        let cartItems = existingCartItems ? JSON.parse(existingCartItems) : {};
        
        if(cartItems.products?.length > 0) {
          const existingCartItem = cartItems.products.find(
            (item: any) => item.productId === productId
            );
            if (existingCartItem) {
              existingCartItem.quantity += cartItem.products[0].quantity;

            } else {
              cartItems.products = [...cartItems.products, cartItem.products[0]];
            }
            localStorage.removeItem('cartItems')
            dispatch(addToCart(cartItems));
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
          }else{
            // Update Local Storage with the updated cartItems
          cartItems =cartItem
          dispatch(addToCart(cartItems));
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
      }

    } catch (error) {
      console.error('Error adding to cart in Firestore:', error);
      throw error;
    }
  }
);

export const removeFromCartFirestore = createAsyncThunk(
  'cart/removeFromCartFirestore',
  async ({productId, owner} : { productId: string, owner: string }, { dispatch }) => {
    if(owner!=="" && productId !== null && owner !== undefined) {
    try {
      const cartCollection = collection(db, 'cart');
      // Retrieve the cart item that contains the product with the specified productId
      const q = query(cartCollection, where('owner', '==', owner));
      const querySnapshot = await getDocs(q);
 
      if (querySnapshot.size > 0) {
        const cartItem = querySnapshot.docs[0].data();
        
        // Filter out the product with productId matching the supplied productId
        const updatedProducts = cartItem.products.filter((product: any) => product.productId !== productId);

        // Update the cart item with the updated products array
        const cartItemRef= doc(cartCollection, querySnapshot.docs[0].id);
        await updateDoc(cartItemRef, {
          products: updatedProducts
        });
      }

      // Update Local Storage
      const cartItemsLocalStorage = localStorage.getItem('cartItems');

      if (cartItemsLocalStorage) {
        const cartItems = JSON.parse(cartItemsLocalStorage);
        const updatedCartItems = cartItems.products.filter((product: any) => product.productId !== productId);

        cartItems.products = updatedCartItems
        const cartItemsToSave ={...cartItems};

        localStorage.setItem('cartItems', JSON.stringify(cartItemsToSave));
      }
      dispatch(removeFromCart(productId));

    } catch (error) {
     console.error('Error removing from cart in Firestore:', error);
     throw error;
   }}
    else {
      // Update Local Storage
      const cartItemsLocalStorage = localStorage.getItem('cartItems');

      if (cartItemsLocalStorage) {
        const cartItems = JSON.parse(cartItemsLocalStorage);
        const updatedCartItems = cartItems.products.filter((product: any) => product.productId !== productId);

        cartItems.products = updatedCartItems
        const cartItemsToSave ={...cartItems};

        localStorage.setItem('cartItems', JSON.stringify(cartItemsToSave));
        dispatch(removeFromCart(productId));
      }
    }

    }
  
);

export const clearCartFirestore = createAsyncThunk(
    'cart/clearCartFirestore',
    async () => {
      try {
        const cartCollection = collection(db, 'cart');
  
        const cartQuery = query(cartCollection);
  
        const cartSnapshot = await getDocs(cartQuery);
        cartSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      } catch (error) {
        console.error('Error clearing cart in Firestore:', error);
        throw error;
      }
    }
  );

