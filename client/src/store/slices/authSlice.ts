import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types";

type AuthSliceType = {
    isAuth: boolean;
    user: User | null;
    otp: {
        email: string;
        hash: string;
    };
};

const initialState: AuthSliceType = {
    isAuth: false,
    user: null,
    otp: {
        email: '',
        hash: ''
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            const { user } = action.payload;
            state.user = user;
            state.isAuth = true;
            state.otp.hash = '';
            state.otp.email = '';
            return state;
        },
        setOtp: (state, action) => {
            const { hash, email } = action.payload;
            state.otp.hash = hash;
            state.otp.email = email;
            return state;
        },
        clearAuth: (state) => {
            state.isAuth = false;
            state.user = null;
            state.otp.hash = '';
            state.otp.email = '';
            return state;
        },
    }
});

export const {
    setAuth,
    setOtp,
    clearAuth,
} = authSlice.actions;

export default authSlice.reducer;