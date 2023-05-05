import { createSlice } from "@reduxjs/toolkit";

const paddingSlice = createSlice({
    name: "padding",
    initialState: {
        paddingNum: 252,
    },
    reducers: {
        toggleBody: (state, action) => {
            state.paddingNum = action.payload;
        },
    },
});

export const { toggleBody } = paddingSlice.actions;

export default paddingSlice.reducer;
