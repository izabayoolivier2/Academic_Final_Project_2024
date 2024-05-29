// actions.js
export const setContent = (content: any) => ({
  type: 'SET_CONTENT',
  content,
});

// reducers.js
const initialState = {
  content: '',
};

export const contentReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case 'SET_CONTENT':
      return { ...state, content: action.content };
    default:
      return state;
  }
};