import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const { expressjwt: jwt } = require('express-jwt');

export const calendarRouter = express.Router()

/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 2 : T_N_T_H
 * @authorized {CheckRole} = 3 : T_N_P_C_T_P
 * @authorized {CheckRole} = 4 : T_N_C_S_K_V
 * @authorized {CheckRole} = 5 : T_N_C_S_T_T
 * @authorized {CheckRole} = 6 : admin
 */

calendarRouter.route('/create-handle').post(jwt(config), checkRole(["1", "2", "6"]), controller.createHandle);
calendarRouter.route('/get-calendar').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6", "7"]), controller.getCalendar);
calendarRouter.route('/show').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6", "7"]), controller.getSearch);
calendarRouter.route('/update-calendar/:id').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6"]), controller.updateHandle);
calendarRouter.route('/delete/:id').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6"]), controller.destroyHandle);
calendarRouter.route('/exports').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6"]), controller.exportToExcel);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           