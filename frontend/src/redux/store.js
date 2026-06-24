import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './slices/roomSlice.js';
import transferReducer from './slices/transferSlice.js';

export const store = configureStore({
  reducer: {
    room: roomReducer,
    transfer: transferReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // We may store files or WebRTC connection info temporarily
    }),
});
