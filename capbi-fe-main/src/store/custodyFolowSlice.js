import { createSlice } from "@reduxjs/toolkit";

const custodyFolowSlice = createSlice({
    name: "custodyFolowSlice",
    initialState: {
        dataMain: {
            id:"",
            returnDate: "",
            licensePlates: "",
            dateOfViolation: "",
            fullName: "",
            onHold: "",
            officerReturns: "",
            returned: "",
        },
    },
    reducers: {
        getData: (state, action) => {
            state.dataMain.id = action.payload.Id;
            state.dataMain.returnDate = action.payload.ReturnDate;
            state.dataMain.licensePlates = action.payload.LicensePlates;
            state.dataMain.dateOfViolation = action.payload.DateOfViolation;
            state.dataMain.onHold = action.payload.OnHold;
            state.dataMain.officerReturns = action.payload.OfficerReturns;
            state.dataMain.fullName = action.payload.FullName;
            state.dataMain.returned = action.payload.Returned;
        },
    },
});

export const { getData } = custodyFolowSlice.actions;

export default custodyFolowSlice.reducer;
