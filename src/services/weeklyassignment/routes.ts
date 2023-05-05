import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const { expressjwt: jwt } = require('express-jwt');

export const weeklyAssignmentRouter = express.Router()

/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 2 : T_N_T_H
 * @authorized {CheckRole} = 3 : T_N_P_C_T_P
 * @authorized {CheckRole} = 4 : T_N_C_S_K_V
 * @authorized {CheckRole} = 5 : T_N_C_S_T_T
 * @authorized {CheckRole} = 6 : admin
 */

weeklyAssignmentRouter.route('/create-handle').post(jwt(config), checkRole(["1", "2", "6"]), controller.createHandle);
weeklyAssignmentRouter.route('/get-weekly-assignment').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6", "7"]), controller.getAllData);
weeklyAssignmentRouter.route('/show').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6", "7"]), controller.getSearch);
weeklyAssignmentRouter.route('/update-handle/:id').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6"]), controller.updateHandle);
weeklyAssignmentRouter.route('/delete/:id').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6"]), controller.destroyHandle);
weeklyAssignmentRouter.route('/exports').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6"]), controller.exportToExcel);