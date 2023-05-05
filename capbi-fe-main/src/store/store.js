import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import custodyFolowSlice from "./custodyFolowSlice";
import foreignerTrackingBookSlice from "./foreignerTrackingBook";
import paddingSlice from "./paddingSlice";
import toastSlice from "./toastSlice";
import vehicleAccreditationSlice from "./vehicleAccreditation";
import vehicleAdministrative from './vehicleAdministrative';
import vehicleCalendar from "./vehicleCalendar";
import vehicleConfirmation from "./vehicleConfirmation";
import vehicleDataStatusBookSlice from "./vehicleDataStatusBookSlice";
import vehicleDispatch from "./vehicleDispatch";
import vehicleHandle from "./vehicleHandle";
import vehicleHandling from "./vehicleHandling";
import vehicleHandlingOnDaySlice from "./vehicleHandlingOnDaySlice";
import vehicleImpound from "./vehicleImpound";
import vehiclePassport from "./vehiclePassport";
import vehicleResident from "./vehicleResident";
import vehicleSanctions from "./vehicleSanctions";
import vehicleTraffic from "./vehicleTraffic";
import vehicleWeeklyAssignment from "./vehicleWeeklyAssignment";
import vehicleWeeklyStatusBookDay from "./vehicleWeeklyStatusBookDay";
const store = configureStore({
  reducer: {
    vehicleAdministrative,
    authSlice,
    paddingSlice,
    vehicleAccreditationSlice,
    vehicleDataStatusBookSlice,
    toastSlice,
    vehiclePassport,
    vehicleWeeklyAssignment,
    custodyFolowSlice,
    vehicleCalendar,
    vehicleConfirmation,
    vehicleDispatch,
    vehicleSanctions,
    vehicleResident,
    vehicleTraffic,
    vehicleImpound,
    vehicleWeeklyStatusBookDay,
    vehicleHandle,
    vehicleHandling,
    vehicleHandlingOnDaySlice,
    foreignerTrackingBookSlice
  },
});

export default store;
