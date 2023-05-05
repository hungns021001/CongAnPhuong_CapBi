const localhost = "http://localhost:80";
const api = "/api";
const auth = "/auth";
const accreditation = "/accreditation";
const nothandle = "/nothandle";
const statusBookRouter = "/statusBookRouter";
const shift = "/shift";
const role = "/role";
const passport = "/passport";
const resident = "/resident";
const calendar = "/calendar";
const impound = "/impound";
const dispatch = "/dispatch";
const confirmation = "/confirmation";
const sanctions = "/sanctions";
const trafficLock = "/trafficLock";
const situation = "/situation";
const weeklyAssignment = "/weeklyAssignment";
const handlingonday = "/handlingonday";
const handling = "/handling";
const administrative = "/administrative";

const apiAuth = api + auth;
const apiAccreditation = api + accreditation;
const apiDispatch = api + dispatch;
const apiConfirmation = api + confirmation;
const apiNothandle = api + nothandle;
const apiAdministrative = api + administrative;
// const apiCalendar = api + calendar;
const apiStatusBookRouter = api + statusBookRouter;
const apiShift = api + shift;
const apiRole = api + role;
const apiPassport = api + passport;
const apiSanctions = api + sanctions;
const apiResident = api + resident;
const apiCalendar = api + calendar;
const apiImpound = api + impound;
const apiTrafficLock = api + trafficLock;
const apiWeeklyAssignment = api + weeklyAssignment;
const apiSituation = api + situation;
const apiHandlingonday = api + handlingonday;
const apiHandling = api + handling;
const foreignerTracking = "/immigrantRouter";

const apiForeignerTracking = api + foreignerTracking;

const SubStrings = {
  subDirection: {
    login: "/",
    imgs: {
      policeLogo: "/police-logo.png",
    },
  },
};


const apiServer = {
  auth: {
    register: apiAuth + "/create-user-handler",
    login: apiAuth + "/login-handle",
  },
  accreditation: {
    get: apiAccreditation + "/get-accreditation",
    edit: apiAccreditation + "/update-accreditation/",
    delete: apiAccreditation + "/delete/",
    create: apiAccreditation + "/create-accreditation",
  },
  nothandle: {
    get: apiNothandle + "/get-nothandle",
    edit: apiNothandle + "/update-nothandle/",
    delete: apiNothandle + "/delete/",
    create: apiNothandle + "/create-nothandle/",
  },
  foreignerTracking: {
    get: apiForeignerTracking + "/get-immigrant",
    edit: apiForeignerTracking + "/update-immigrant/",
    delete: apiForeignerTracking + "/delete/",
    create: apiForeignerTracking + "/create-immigrant-handler",
  },

  administrative: {
    get: apiAdministrative + "/get-administrative",
    edit: apiAdministrative + "/update-administrative/",
    delete: apiAdministrative + "/delete/",
    create: apiAdministrative + "/create-administrative-handler/",
  },
  // calendar: {
  //   get: apiCalendar + "/get-calendar",
  //   edit: apiCalendar + "/update-calendar/",
  //   delete: apiCalendar + "/delete/",
  //   create: apiCalendar + "/create-handle/",
  // },

  statusBookRouter: {
    get: apiStatusBookRouter + "/get-status-book",
    edit: apiStatusBookRouter + "/update-status-book/",
    delete: apiStatusBookRouter + "/delete/",
    create: apiStatusBookRouter + "/create-status-book-handler",
  },

  shift: {
    get: apiShift + "/get-shift",
    edit: apiShift + "/update-shift/",
    delete: apiShift + "/delete/",
    create: apiShift + "/create-shift-handler",
  },

  weeklyAssignment: {
    get: apiWeeklyAssignment + "/get-weekly-assignment",
    edit: apiWeeklyAssignment + "/update-handle/",
    delete: apiWeeklyAssignment + "/delete/",
    create: apiWeeklyAssignment + "/create-handle",
  },
  roles: {
    get: apiRole + "/get-role",
  },
  passport: {
    get: apiPassport + "/get-passport",
    edit: apiPassport + "/update-passport/",
    delete: apiPassport + "/delete/",
    create: apiPassport + "/create-passport-handler",
  },
  dispatch: {
    get: apiDispatch + "/get-dispatch",
    edit: apiDispatch + "/update-dispatch/",
    delete: apiDispatch + "/delete/",
    create: apiDispatch + "/create-dispatch-handler",
  },
  sanctions: {
    get: apiSanctions + "/get-sanctions",
    edit: apiSanctions + "/update-sanctions/",
    delete: apiSanctions + "/delete/",
    create: apiSanctions + "/create-sanctions-handler",
  },
  confirmation: {
    get: apiConfirmation + "/get-confirmation",
    edit: apiConfirmation + "/update-confirmation/",
    delete: apiConfirmation + "/delete/",
    create: apiConfirmation + "/create-confirmation-handler",
  },
  trafficLock: {
    get: apiTrafficLock + "/get-traffic-lock",
    edit: apiTrafficLock + "/update-handle/",
    delete: apiTrafficLock + "/delete/",
    create: apiTrafficLock + "/create-handle",
  },
  resident: {
    get: apiResident + "/get-resident",
    edit: apiResident + "/update-resident/",
    delete: apiResident + "/delete/",
    create: apiResident + "/create-resident-handler",
  },
  calendar: {
    get: apiCalendar + "/get-calendar",
    edit: apiCalendar + "/update-calendar",
    delete: apiCalendar + "/delete",
    create: apiCalendar + "/create-handle",
  },
  impound: {
    get: apiImpound + "/get-impound",
    edit: apiImpound + "/update-handle/",
    delete: apiImpound + "/delete/",
    create: apiImpound + "/create-handle",
  },
  situation: {
    get: apiSituation + "/get-situation",
    edit: apiSituation + "/update-situation/",
    delete: apiSituation + "/delete/",
    create: apiSituation + "/create-handle",
  },
  handlingonDay: {
    create: apiHandlingonday + "/create-handle",
    get: apiHandlingonday + "/get-handle",
    delete: apiHandlingonday + "/delete/",
    edit: apiHandlingonday + "/update/",
  },
  handling: {
    get: apiHandling + "/get-handling",
    edit: apiHandling + "/update-handle/",
    delete: apiHandling + "/delete/",
    create: apiHandling + "/create-handle",
  }
};

// For testing on local
const apiLocalhost = {
  register: localhost + apiServer.auth.register,
  accreditation: {
    get: localhost + apiAccreditation + "/get-accreditation",
    edit: localhost + apiAccreditation + "/update-accreditation/",
    delete: localhost + apiAccreditation + "/delete/",
    create: localhost + apiAccreditation + "/create-accreditation",
  },
  dispatch: {
    get: localhost + apiDispatch + "/get-dispatch",
    edit: localhost + apiDispatch + "/update-dispatch/",
    delete: localhost + apiDispatch + "/delete/",
    create: localhost + apiDispatch + "/create-dispatch-handler",
  },
  sanctions: {
    get: localhost + apiSanctions + "/get-sanctions",
    edit: localhost + apiSanctions + "/update-sanctions/",
    delete: localhost + apiSanctions + "/delete/",
    create: localhost + apiSanctions + "/create-sanctions-handler",
  },
  foreignerTracking: {
    get: localhost + "/get-immigrant",
    edit: localhost + "/update-immigrant/",
    delete: localhost + "/delete/",
    create: localhost + "/create-immigrant-handler",
  },

  confirmation: {
    get: localhost + apiConfirmation + "/get-confirmation",
    edit: localhost + apiConfirmation + "/update-confirmation/",
    delete: localhost + apiConfirmation + "/delete/",
    create: localhost + apiConfirmation + "/create-confirmation-handler",
  },
  resident: {
    get: localhost + apiResident + "/get-resident",
    edit: localhost + apiResident + "/update-resident/",
    delete: localhost + apiResident + "/delete/",
    create: localhost + apiResident + "/create-resident-handler",
  },
  impound: {
    get: localhost + apiImpound + "/get-impound",
    edit: localhost + apiImpound + "/update-handle/",
    delete: localhost + apiImpound + "/delete/",
    create: localhost + apiImpound + "/create-handle",
  },
  trafficLock: {
    get: localhost + apiTrafficLock + "/get-traffic-lock",
    edit: localhost + apiTrafficLock + "/update-handle/",
    delete: localhost + apiTrafficLock + "/delete/",
    create: localhost + apiTrafficLock + "/create-handle",
  },
};

export { SubStrings, apiServer, apiLocalhost };

