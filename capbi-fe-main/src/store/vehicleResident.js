import { createSlice } from "@reduxjs/toolkit";

const vehicleResident = createSlice({
    name: "vehicleResident",
    initialState: {
        dataMain: {
            Id: "",
            date: "",
            address: "",
            host: "",
            fullName: "",
            citizenNumber: "",
            violationer: "",
            formProcessing: "",
            policeCheck: "",
        },
    },
    reducers: {
        getData: (state, action) => {
            state.dataMain.Id = action.payload.Id;
            state.dataMain.date = action.payload.Date;
            state.dataMain.address = action.payload.Address;
            state.dataMain.host = action.payload.Host;
            state.dataMain.fullName = action.payload.FullName;
            state.dataMain.citizenNumber = action.payload.CitizenNumber;
            state.dataMain.violationer = action.payload.Violationer;
            state.dataMain.formProcessing = action.payload.FormProcessing;
            state.dataMain.policeCheck = action.payload.PoliceCheck;
        },
    },
});

export const { getData } = vehicleResident.actions;

export default vehicleResident.reducer;
