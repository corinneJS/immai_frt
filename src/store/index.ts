import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import exerciseReducer from './slices/exerciseSlice';

// Configuration du store Redux
export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    exercise: exerciseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;