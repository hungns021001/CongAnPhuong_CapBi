import { createSlice } from "@reduxjs/toolkit";

const vehicleWeeklyAssignment = createSlice({
    name: "vehicleWeeklyAssignment",
    initialState: {
        dataWeeklyAssignment: {
    id: "",
    days : "",
    date : "",
    captain: "",
    inHour: "",
    overTime: "",
    onDuty : "",
    patrolShiftOne : "",
    patrolShiftTwo : ""
        },
       
    },
    reducers: {
        getDataWeeklyAssignment: (state, action) => {
            state.dataWeeklyAssignment.id = action.payload.Id;
            state.dataWeeklyAssignment.days = action.payload.Days;
            state.dataWeeklyAssignment.date = action.payload.Date;
            state.dataWeeklyAssignment.captain = action.payload.Captain;
            state.dataWeeklyAssignment.inHour = action.payload.InHour;
            state.dataWeeklyAssignment.overTime= action.payload.OverTime;
            state.dataWeeklyAssignment.onDuty= action.payload.OnDuty;
            state.dataWeeklyAssignment.patrolShiftOne = action.payload.PatrolShiftOne;
            state.dataWeeklyAssignment.patrolShiftTwo = action.payload.PatrolShiftTwo;
        },
       
    },
});

export const { getDataWeeklyAssignment } = vehicleWeeklyAssignment.actions;


export default vehicleWeeklyAssignment.reducer;
