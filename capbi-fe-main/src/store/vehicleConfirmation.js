import { createSlice } from "@reduxjs/toolkit";

const vehicleConfirmation = createSlice({
    name: "vehicleConfirmation",
    initialState: {
        dataMain: {
            id: "",
            date: "",
            fullName: "",
            gender: "",
            birthday: "",
            staying: "",
            grantReason: "",
            verifier: "",
            leaderSign: ""
        },
    },
    reducers: {
        getData: (state, action) => {
            state.dataMain.id = action.payload.id;
            state.dataMain.date = action.payload.Date;
            state.dataMain.fullName = action.payload.FullName;
            state.dataMain.gender = action.payload.Gender;
            state.dataMain.birthday = action.payload.Birthday;
            state.dataMain.staying = action.payload.Staying;
            state.dataMain.grantReason = action.payload.GrantReason;
            state.dataMain.verifier = action.payload.Verifier;
            state.dataMain.leaderSign = action.payload.LeaderSign;
        },
    },
});

export const { getData } = vehicleConfirmation.actions;

export default vehicleConfirmation.reducer;
