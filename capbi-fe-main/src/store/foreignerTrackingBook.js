import { createSlice } from "@reduxjs/toolkit";

const foreignerTrackingBookSlice = createSlice({
  name: "foreignerTrackingBookSlice",
  initialState: {
    dataMain: {
      Id: "",
      RegisterDate: "",
      FullName: "",
      BirthDay: "",
      Country: "",
      ResidentialAddress: "",
      Passport: "",
      RecidencePermitNumber: "",
      Job: "",
      EntryDate: "",
      GateEntry: "",
      EntryPurpose: "",
      SojournDateFrom: "",
      SojournDateTo: "",
      GuarantorName: "",
      FullNamePolice: "",
      PoliceLead: "",
    },
  },
  reducers: {
    getDataForeignerTrackingBookSlice: (state, action) => {
      state.dataMain.Id = action.payload.Id;
      state.dataMain.RegisterDate = action.payload.RegisterDate;
      state.dataMain.FullName = action.payload.FullName;
      state.dataMain.BirthDay = action.payload.BirthDay;
      state.dataMain.Country = action.payload.Country;
      state.dataMain.ResidentialAddress = action.payload.ResidentialAddress;
      state.dataMain.Passport = action.payload.Passport;
      state.dataMain.RecidencePermitNumber = action.payload.RecidencePermitNumber;
      state.dataMain.Job = action.payload.Job;
      state.dataMain.EntryDate = action.payload.EntryDate;
      state.dataMain.GateEntry = action.payload.GateEntry;
      state.dataMain.EntryPurpose = action.payload.EntryPurpose;
      state.dataMain.SojournDateFrom = action.payload.SojournDateFrom;
      state.dataMain.SojournDateTo = action.payload.SojournDateTo;
      state.dataMain.GuarantorName = action.payload.GuarantorName;
      state.dataMain.FullNamePolice = action.payload.FullNamePolice;
      state.dataMain.PoliceLead = action.payload.PoliceLead;
    },
  },
});

export const { getDataForeignerTrackingBookSlice } = foreignerTrackingBookSlice.actions;

export default foreignerTrackingBookSlice.reducer;
