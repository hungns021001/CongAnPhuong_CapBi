import { createSlice } from "@reduxjs/toolkit";

const vehicleHandlingOnDaySlice = createSlice({
  name: "vehicleHandlingOnDaySlice",
  initialState: {
    dataHandlingOnDay: {
      id: "",
      licensePlates: "",
      dateOfViolation: "",
      addressOfViolation: "",
      violation: "",
      fullName: "",
      custody: "",
      handoverUnit: "",
      receiver: "",
      amount: "",
      picture: "",
      result: "",
      verify: "",
    },
  },
  reducers: {
    getDataHandlingOnDay: (state, action) => {
      state.dataHandlingOnDay.id = action.payload.Id;
      state.dataHandlingOnDay.licensePlates = action.payload.LicensePlates;
      state.dataHandlingOnDay.dateOfViolation = action.payload.DateOfViolation;
      state.dataHandlingOnDay.addressOfViolation =
        action.payload.AddressOfViolation;
      state.dataHandlingOnDay.violation = action.payload.Violation;
      state.dataHandlingOnDay.fullName = action.payload.FullName;
      state.dataHandlingOnDay.custody = action.payload.Custody;
      state.dataHandlingOnDay.handoverUnit = action.payload.HandoverUnit;
      state.dataHandlingOnDay.receiver = action.payload.Receiver;
      state.dataHandlingOnDay.amount = action.payload.Amount;
      // state.dataHandlingOnDay.picture = action.payload.Picture;
      state.dataHandlingOnDay.result = action.payload.Result;
     
    },
  },
});

export const { getDataHandlingOnDay } = vehicleHandlingOnDaySlice.actions;
export default vehicleHandlingOnDaySlice.reducer;
