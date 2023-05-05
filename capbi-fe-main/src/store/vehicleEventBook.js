import { createSlice } from "@reduxjs/toolkit";

const vehicleEventBook = createSlice({
    name: "vehicleEventBook",
    initialState: {
        dataEventBook: {
    date : "",
    location: "",
    force: "",
    mission: "",
    note : "",
        },
       
    },
    reducers: {
        getDataEventBook: (state, action) => {
            state.dataEventBook.date = action.payload.Date;
            state.dataEventBook.location = action.payload.Location;
            state.dataEventBook.force = action.payload.Force;
            state.dataEventBook.mission= action.payload.Mission;
            state.dataEventBook.note= action.payload.Note;
        },
       
    },
});

export const { getDataEventBook } = vehicleEventBook.actions;


export default vehicleEventBook.reducer;
