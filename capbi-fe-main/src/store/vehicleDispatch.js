import { createSlice } from "@reduxjs/toolkit";

const vehicleDispatch = createSlice({
    name: "vehicleDispatch",
    initialState: {
        dataMain: {
            id: "",
            dateTime: "",
            dispatchID: "",
            releaseDate: "",
            subject: "",
            agencyissued: "",
            receiver: "",
        },
    },
    reducers: {
        getData: (state, action) => {
            state.dataMain.id = action.payload.Id;
            state.dataMain.dateTime = action.payload.Datetime;
            state.dataMain.dispatchID = action.payload.DispatchID;
            state.dataMain.releaseDate = action.payload.ReleaseDate;
            state.dataMain.subject = action.payload.Subject;
            state.dataMain.agencyissued = action.payload.AgencyIssued;
            state.dataMain.receiver = action.payload.Receiver;
        },
    },
});

export const { getData } = vehicleDispatch.actions;

export default vehicleDispatch.reducer;
