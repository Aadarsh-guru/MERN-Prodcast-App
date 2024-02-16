import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: '',
};

const activateSlice = createSlice({
    name: 'activate',
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
            return state;
        },
    }
});

export const {
    setName,
} = activateSlice.actions;

export default activateSlice.reducer;