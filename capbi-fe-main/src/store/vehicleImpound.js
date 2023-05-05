import { createSlice } from "@reduxjs/toolkit";

const vehicleImpound = createSlice({
    name: "vehicleImpound",
    initialState: {
        dataMain: {
            Id: "",
            returnDate: "",
            licensePlates: "",
            dateOfViolation: "",
            fullname: "",
            onHold: "",
            returned: "",
            officerReturns: "",
        },
    },
    reducers: {
        getData: (state, action) => {
            state.dataMain.Id = action.payload.Id;
            state.dataMain.returnDate = action.payload.ReturnDate;
            state.dataMain.licensePlates = action.payload.LicensePlates;
            state.dataMain.dateOfViolation = action.payload.DateOfViolation;
            state.dataMain.fullname = action.payload.FullName;
            state.dataMain.onHold = action.payload.OnHold;
            state.dataMain.returned = action.payload.Returned;
            state.dataMain.officerReturns = action.payload.OfficerReturns;
        },
    },
});

export const { getData } = vehicleImpound.actions;

export default vehicleImpound.reducer;
