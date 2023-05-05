import { createSlice } from "@reduxjs/toolkit";

const vehicleSanctions = createSlice({
    name: "vehicleSanctions",
    initialState: {
        dataMain: {
            id: "",
            decisionId: "",
            fullName: "",
            birthday: "",
            staying: "",
            nation: "",
            country: "",
            job: "",
            content: "",
            punisher: "",
            processingForm: "",
            fullnamePolice: "",
        },
    },
    reducers: {
        getData: (state, action) => {
            state.dataMain.id = action.payload.Id;
            state.dataMain.decisionId = action.payload.DecisionId;
            state.dataMain.fullName = action.payload.FullName;
            state.dataMain.birthday = action.payload.Birthday;
            state.dataMain.staying = action.payload.Staying;
            state.dataMain.nation = action.payload.Nation;
            state.dataMain.country = action.payload.Country;
            state.dataMain.job = action.payload.Job;
            state.dataMain.content = action.payload.Content;
            state.dataMain.punisher = action.payload.Punisher;
            state.dataMain.processingForm = action.payload.ProcessingForm;
            state.dataMain.fullnamePolice = action.payload.FullNamePolice;
        },
    },
});

export const { getData } = vehicleSanctions.actions;

export default vehicleSanctions.reducer;
