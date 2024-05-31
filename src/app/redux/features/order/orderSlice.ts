import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Service {
  name: string;
  price: number;
}

interface CustomerInfo {
  name: string;
  contact: string;
}

interface Order {
  eventType: string;
  total: number;
  services: Service[];
  customerInfo: CustomerInfo;
  error: string | null;
}

interface OrderState {
  orders: Order[];
}

const initialState: OrderState = {
  orders: [],
};

const orderslice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    updateOrder(state, action: PayloadAction<{ index: number; order: Order }>) {
      const { index, order } = action.payload;
      if (index >= 0 && index < state.orders.length) {
        state.orders[index] = order;
      }
    },
    removeOrder(state, action: PayloadAction<number>) {
      state.orders.splice(action.payload, 1);
    },
  },
});

export const { setOrders, addOrder, updateOrder, removeOrder } = orderslice.actions;

export default orderslice.reducer;
