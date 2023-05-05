import { createSlice } from "@reduxjs/toolkit";

const vehicleDataStatusBookSlice = createSlice({
  name: "vehicleDataStatusBookSlice",
  initialState: {
    dataStatusBook: {
      id: "",
      dateTime: "",
      personOnDuty: "",
      details: "",
      handler: "",
      note: "",
    },
  },
  reducers: {
    getDataStatusBook: (state, action) => {
      state.dataStatusBook.id = action.payload.Id;
      state.dataStatusBook.dateTime = action.payload.DateTime;
      state.dataStatusBook.personOnDuty = action.payload.PersonOnDuty;
      state.dataStatusBook.details = action.payload.Details;
      state.dataStatusBook.handler = action.payload.Handler;
      state.dataStatusBook.note = action.payload.Note;
    },
  },
});

export const { getDataStatusBook } = vehicleDataStatusBookSlice.actions;

export default vehicleDataStatusBookSlice.reducer;
