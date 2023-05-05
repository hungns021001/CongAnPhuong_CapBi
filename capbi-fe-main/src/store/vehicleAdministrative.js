import { createSlice } from "@reduxjs/toolkit";

const vehicleAdministrative = createSlice({
  name: "vehicleAdministrative",
  initialState: {
    dataAdministrative: {
      id: "",
      date: "",
      dispatchId: "",
      releaseDate: "",
      agencyIssued: "",
      fullName: "",
      settlementTime: "",
      result: "",
    },
  },
  reducers: {
    getDataAdministrative: (state, action) => {
      state.dataAdministrative.id = action.payload.Id;
      state.dataAdministrative.date = action.payload.Date;
      state.dataAdministrative.dispatchId = action.payload.DispatchId;
      state.dataAdministrative.releaseDate = action.payload.ReleaseDate;
      state.dataAdministrative.agencyIssued = action.payload.AgencyIssued;
      state.dataAdministrative.fullName = action.payload.FullName;
      state.dataAdministrative.settlementTime = action.payload.SettlementTime;
      state.dataAdministrative.result = action.payload.Result;
    },
  },
});

export const { getDataAdministrative } = vehicleAdministrative.actions;

export default vehicleAdministrative.reducer;
