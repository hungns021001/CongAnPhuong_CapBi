import { createSlice } from "@reduxjs/toolkit";

const vehicleTraffic = createSlice({
    name: "vehicleTraffic",
    initialState: {
        dataMain: {
            id: "",
            days: "",
            date:"",
            trafficIntersection: "",
            morning: "",
            afternoon: "",
            note: "",
        },
    },
    reducers: {
        getData: (state, action) => {
            state.dataMain.id = action.payload.Id;
            state.dataMain.days = action.payload.Days;
            state.dataMain.date = action.payload.Date;
            state.dataMain.trafficIntersection = action.payload.TrafficIntersection;
            state.dataMain.morning = action.payload.Morning;
            state.dataMain.afternoon = action.payload.Afternoon;
            state.dataMain.note = action.payload.Note;
        },
    },
});

export const { getData } = vehicleTraffic.actions;
export default vehicleTraffic.reducer;