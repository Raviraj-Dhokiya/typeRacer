// frontend/store/index.js
// Redux store — combines all slices

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import resultsReducer from './resultsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    results: resultsReducer,
  },
});

export default store;
