import { createSlice } from "@reduxjs/toolkit";

const vehicleWeeklyStatusBookDay = createSlice({
    name: "vehicleWeeklyStatusBookDay",
    initialState: {
        dataStatusBookDay: {
            id: "",
            date: "",
            forceOnDuty: "",
            caseName: "",
            location: "",
            content: "",
            receive: "",
            custody: "",
            returns: "",
            handOver: "",
        },
       
    },
    reducers: {
        getDataStatusBookDay: (state, action) => {
            state.dataStatusBookDay.id = action.payload.Id;
            state.dataStatusBookDay.date = action.payload.Date;
            state.dataStatusBookDay.forceOnDuty = action.payload.ForceOnDuty;
            state.dataStatusBookDay.caseName = action.payload.CaseName;
            state.dataStatusBookDay.location = action.payload.Location;
            state.dataStatusBookDay.content= action.payload.Content;
            state.dataStatusBookDay.receive= action.payload.Receive;
            state.dataStatusBookDay.custody = action.payload.Custody;
            state.dataStatusBookDay.returns = action.payload.Returns;
            state.dataStatusBookDay.handOver = action.payload.HandOver;
        },
       
    },
});

export const { getDataStatusBookDay } = vehicleWeeklyStatusBookDay.actions;


export default vehicleWeeklyStatusBookDay.reducer;
