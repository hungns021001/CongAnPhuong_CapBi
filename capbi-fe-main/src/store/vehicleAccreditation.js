import { createSlice } from "@reduxjs/toolkit";

const vehicleAccreditationSlice = createSlice({
    name: "vehicleAccreditationSlice",
    initialState: {
        dataMain: {
            id: "",
            dateSend: "",
            licensePlates: "",
            receiver: "",
            finePaymentDate: "",
            violation: "",
        },
    },
    reducers: {
        getData: (state, action) => {
            state.dataMain.id = action.payload.Id;
            state.dataMain.dateSend = action.payload.DateSend;
            state.dataMain.licensePlates = action.payload.LicensePlates;
            state.dataMain.receiver = action.payload.Receiver;
            state.dataMain.finePaymentDate = action.payload.FinePaymentDate;
            state.dataMain.violation = action.payload.Violation;
        },
    },
});

export const { getData } = vehicleAccreditationSlice.actions;

export default vehicleAccreditationSlice.reducer;
