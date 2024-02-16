import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import activateSlice from "./slices/activateSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        activate: activateSlice
    }
});

export type RootState = ReturnType<typeof store.getState>

export default store;