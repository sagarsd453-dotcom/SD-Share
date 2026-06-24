import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roomId: null,
  isCreator: false,
  status: 'disconnected', // 'disconnected', 'connecting', 'connected'
  peerId: null,
  logs: [],
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomInfo: (state, action) => {
      state.roomId = action.payload.roomId;
      state.isCreator = action.payload.isCreator;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setPeerId: (state, action) => {
      state.peerId = action.payload;
    },
    addLog: (state, action) => {
      state.logs.push({
        id: Date.now() + Math.random(),
        message: action.payload.message,
        type: action.payload.type || 'info',
        timestamp: new Date().toISOString()
      });
    },
    resetRoom: () => initialState,
  },
});

export const { setRoomInfo, setStatus, setPeerId, addLog, resetRoom } = roomSlice.actions;
export default roomSlice.reducer;
