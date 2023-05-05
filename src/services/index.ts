import * as express from 'express';

import { authRouter } from './auth';
import { roleRouter } from './role';
import { shiftRouter } from './shift';
import { trackingRouter } from './tracking';
import { sanctionsRouter } from './sanctions';
import { dispatchRouter } from './dispatch';
import { statusBookRouter } from './statusBook';
import { handlingRoutes } from './handling';
import { immigrantRouter } from './immigrant';
import { passportRouter } from './citizenpassport';
import { nothandleRouter } from './nothandle';
import { accreditationRouter } from './accreditation';
import { assignRouter } from './assigntask';
import { userRouter } from './user';
import { confirmationRouter } from './confirmation';
import { handlingondayRoutes } from './handlingonday/routes';
import { situationRouter } from './situation';
import { resident } from './resident';
import { calendarRouter } from './calendar';
import { impoundRouter } from './impoundhandlevehicles';
import { administrativeRouter } from './administrative';
import { weeklyAssignmentRouter } from './weeklyassignment';
import { trafficLockRouter } from './trafficlock';
import {adminOperationRouter} from "./adminOperations";

export const services = express.Router();

services.use('/auth', authRouter);
services.use('/role', roleRouter);
services.use('/shift', shiftRouter);
services.use('/tracker', trackingRouter);
services.use('/sanctions', sanctionsRouter);
services.use('/dispatch', dispatchRouter);
services.use('/sanctions', sanctionsRouter)
services.use('/statusBookRouter', statusBookRouter);
services.use('/handling', handlingRoutes)
services.use('/immigrantRouter', immigrantRouter)
services.use('/passport', passportRouter);
services.use('/nothandle', nothandleRouter);
services.use('/accreditation', accreditationRouter);
services.use('/assign', assignRouter);
services.use('/confirmation', confirmationRouter);
services.use('/handlingonday', handlingondayRoutes);
services.use('/situation', situationRouter);
services.use('/resident', resident);
services.use('/calendar', calendarRouter);
services.use('/impound', impoundRouter);
services.use('/administrative', administrativeRouter);
services.use('/weeklyAssignment', weeklyAssignmentRouter);
services.use('/trafficLock', trafficLockRouter);
services.use('/users', userRouter);
services.use('/admin', adminOperationRouter);
