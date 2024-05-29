// actions.js
export const setShippingAddress = (shippingAddress: any) => ({
  type: 'SET_SHIPPING_ADDRESS',
  shippingAddress,
});

// reducers.js
const initialState = {
  shippingAddress: '',
};

export const addressReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case 'SET_SHIPPING_ADDRESS':
      return { ...state, shippingAddress: action.shippingAddress };
    default:
      return state;
  }
};
