import { createSlice } from "@reduxjs/toolkit";

const vehiclePassport = createSlice({
  name: "vehiclePassport",
  initialState: {
    dataPassport: {
      id: "",
      fullName: "",
      birthday: "",
      gender: "",
      staying: "",
      confirmationDate: "",
      fullNamePolice: "",
      leaderSign: "",
    },
  },
  reducers: {
    getDataPassport: (state, action) => {
      state.dataPassport.id = action.payload.Id;
      state.dataPassport.fullName = action.payload.FullName;
      state.dataPassport.birthday = action.payload.Birthday;
      state.dataPassport.gender = action.payload.Gender;
      state.dataPassport.staying = action.payload.Staying;
      state.dataPassport.confirmationDate = action.payload.ConfirmationDate;
      state.dataPassport.fullNamePolice = action.payload.FullNamePolice;
      state.dataPassport.leaderSign = action.payload.LeaderSign;
    },
  },
});

export const { getDataPassport } = vehiclePassport.actions;

export default vehiclePassport.reducer;
