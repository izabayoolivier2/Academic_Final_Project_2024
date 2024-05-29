// cartSlice.ts
import { RootState } from '../../store';
import { db } from '@/app/firebase/config';
import { CartItem } from '@/app/models/Cart';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, CollectionReference, doc, DocumentData, getDocs,updateDoc, query, setDoc, where } from 'firebase/firestore';


interface CartState {
  items: any;
}

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem>) => {
      state.items = action.payload
    },

    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items = action.payload;
    },

    updateCartItemQuantity: (state, action: PayloadAction<{ productId: string; quantity: number, owner: string }>) => {
      const { productId, quantity, owner } = action.payload;
      const cartItemToUpdate = state.items.products.find((item: any) => item.productId === productId);
      if (cartItemToUpdate && owner) {
        // cartItemToUpdate.quantity += quantity;
        try {
          const cartCollection: CollectionReference<DocumentData> = collection(db, 'cart');
          const existingCartItemQuery = 
          query(cartCollection, 
            where("owner", "==", owner)
            );
            
            getDocs(existingCartItemQuery).then(existingCartItemSnapshot => {
              const existingCartItemDoc = existingCartItemSnapshot.docs[0];
              if (existingCartItemDoc?.exists()) {
                const updatedProducts = existingCartItemDoc.data().products.map((product: any) => {
                  if (product.productId === productId) {
                    return {
                      ...product,
                      quantity: product.quantity + quantity,
                    };
                  }
                  return product;
                });
                
                updateDoc(existingCartItemDoc.ref, {
                  products: updatedProducts,
                });

                // After updating Firestore, update Local Storage
                const existingCartItems = localStorage.getItem('cartItems');
                let cartItems = existingCartItems ? JSON.parse(existingCartItems) : {};
                
                if(cartItems.products?.length > 0) {
                  const existingCartItem = cartItems.products.find(
                    (item: any) => item.productId === productId
                    );
                    if (existingCartItem) {
                      existingCartItem.quantity += quantity;
                      localStorage.removeItem('cartItems')
                      localStorage.setItem('cartItems', JSON.stringify(cartItems));
                      state.items.products.find((item: any) => item.productId === productId).quantity += quantity
                    } else return
                  }

                } 
              })}
              
              catch (error) {
                console.error('Error adding to cart in Firestore:', error);
                throw error;
              }
            }
            else {
                // After updating Firestore, update Local Storage
                const existingCartItems = localStorage.getItem('cartItems');
                let cartItems = existingCartItems ? JSON.parse(existingCartItems) : {};
                
                if(cartItems.products?.length > 0) {
                  const existingCartItem = cartItems.products.find(
                    (item: any) => item.productId === productId
                    );
                    if (existingCartItem) {
                      existingCartItem.quantity += quantity;
                      localStorage.removeItem('cartItems')
                      localStorage.setItem('cartItems', JSON.stringify(cartItems));
                      state.items.products.find((item: any) => item.productId === productId).quantity += quantity
                    } else return
                  }
                }
          },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const productIdToRemove = action.payload;
    
      // Use filter to create a new products array without the item to remove
      state.items.products = state.items.products.filter((item: any) => item.productId !== productIdToRemove);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCartItems, addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
export const selectCartItems = (state: RootState) => state.cart.items[0].products;
