import { configureStore } from '@reduxjs/toolkit';  // Redux Toolkit method to create store easily
import userReducer from './userSlice';              // Import user slice reducer

// Import redux-persist utilities for persisting Redux state across sessions
import {
  persistStore,      // Used to create a persistor that controls persistence lifecycle
  persistReducer,    // Wraps your reducer to enable persistence
  FLUSH,             // Redux-persist action types used to be ignored by middleware
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage';  // Default storage is localStorage for web

// Configuration object for redux-persist
const persistConfig = {
  key: 'user',         // Key name used in localStorage to save the persisted state
  storage,             // Define which storage engine to use (localStorage in this case)
  whitelist: ['user', 'token', 'loading', 'error'], // Only persist these keys from the user slice state
  // Note: If your userSlice state shape looks like { user, token, loading, error }, this ensures only these are saved.
};

// Wrap userReducer with persistReducer to create a persisted reducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Create Redux store using Redux Toolkit's configureStore
export const store = configureStore({
  reducer: {
    user: persistedUserReducer,  // Register persisted user reducer under 'user' key
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Middleware in Redux Toolkit checks that actions & state are serializable by default
        // redux-persist dispatches some non-serializable actions internally
        // So we instruct the middleware to ignore these redux-persist specific action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor linked to the store, which controls persistence lifecycle (rehydration, purge, etc.)
export const persistor = persistStore(store);
