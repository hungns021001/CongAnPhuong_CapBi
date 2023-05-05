import { createSlice } from "@reduxjs/toolkit";

const vehicleHandling = createSlice({
  name: "vehicleHandling",
  initialState: {
    dataHandling: {
      id: "",
      dateViolation: "",
      addressViolation: "",
      nameOfViolation: "",
      content: "",
      directiveInformation: "",
      fullNamePolice: "",
      violatingImages: "",
      result: "",
    },
  },
  reducers: {
    getDataHandling: (state, action) => {
      state.dataHandling.id = action.payload.Id;
      state.dataHandling.dateViolation = action.payload.DateViolation;
      state.dataHandling.addressViolation = action.payload.AddressViolation;
      state.dataHandling.nameOfViolation = action.payload.NameOfViolation;
      state.dataHandling.content = action.payload.Content;
      state.dataHandling.directiveInformation = action.payload.DirectiveInformation;
      state.dataHandling.fullNamePolice = action.payload.FullNamePolice ;
      state.dataHandling.violatingImages = action.payload.ViolatingImages;
      state.dataHandling.result = action.payload.Result;
    },
  },
});

export const { getDataHandling } = vehicleHandling.actions;

export default vehicleHandling.reducer;
