import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const { expressjwt: jwt } = require('express-jwt');
export const impoundRouter = express.Router()
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 2 : T_N_T_H
 * @authorized {CheckRole} = 3 : T_N_P_C_T_P
 * @authorized {CheckRole} = 4 : T_N_C_S_K_V
 * @authorized {CheckRole} = 5 : T_N_C_S_T_T
 * @authorized {CheckRole} = 6 : admin
 * @authorized {CheckRole} = 8 : C_B_N_P_C_T_P
 */

impoundRouter.route('/create-handle').post(jwt(config), checkRole(["1", "3", "4", "6"]), controller.createHandle);
impoundRouter.route('/get-impound').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6", "8"]), controller.getImpoundHandleVehicles);
impoundRouter.route('/show').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6", "8"]), controller.getSearch);
impoundRouter.route('/update-handle/:id').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6"]), controller.updateHandle);
impoundRouter.route('/delete/:id').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6"]), controller.destroyHandle);
impoundRouter.route('/exports').post(jwt(config), checkRole(["1", "2", "3", "4", "5", "6"]), controller.exportToExcel);