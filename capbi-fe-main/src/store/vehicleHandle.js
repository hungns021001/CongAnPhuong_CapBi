import { createSlice } from "@reduxjs/toolkit";

const vehicleHandle = createSlice({
  name: "vehicleHandle",
  initialState: {
    dataHandle: {
      id: "",
      dateOfViolation: "",
      violation: "",
      locationViolation: "",
      lisencePlate: "",
      nameViolator: "",
      nameBailsman: "",
      solCommander: "",
      staffReceive: "",
    },
  },
  reducers: {
    getDataHandle: (state, action) => {
      state.dataHandle.id = action.payload.Id;
      state.dataHandle.dateOfViolation = action.payload.DateOfViolation;
      state.dataHandle.violation = action.payload.Violation;
      state.dataHandle.locationViolation = action.payload.LocationViolation;
      state.dataHandle.lisencePlate = action.payload.LisencePlate;
      state.dataHandle.nameViolator = action.payload.NameViolator;
      state.dataHandle.nameBailsman = action.payload.NameBailsman;
      state.dataHandle.solCommander = action.payload.SolCommander;
      state.dataHandle.staffReceive = action.payload.StaffReceive;
    },
  },
});

export const { getDataHandle } = vehicleHandle.actions;

export default vehicleHandle.reducer;
