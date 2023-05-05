import { createSlice } from "@reduxjs/toolkit";

const vehicleCalendar = createSlice({
  name: "vehicleCalendar",
  initialState: {
    dataCalendar: {
      id: "",
      date: "",
      location: "",
      force: "",
      mission: "",
      note: "",
      
    },
  },
  reducers: {
    getDataCalendar: (state, action) => {
      state.dataCalendar.id = action.payload.Id;
      state.dataCalendar.date = action.payload.Date;
      state.dataCalendar.location = action.payload.Location;
      state.dataCalendar.force = action.payload.Force;
      state.dataCalendar.mission = action.payload.Mission;
      state.dataCalendar.note = action.payload.Note;
     
    },
  },
});

export const { getDataCalendar } = vehicleCalendar.actions;

export default vehicleCalendar.reducer;
