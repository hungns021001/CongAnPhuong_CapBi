import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const { expressjwt: jwt } = require('express-jwt');

export const shiftRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 2 : N_T_H
 * @authorized {CheckRole} = 6 : admin
 */
shiftRouter.route('/create-shift-handler').post(jwt(config), checkRole(["1", "2", "6"]), controller.createShiftHandler);
shiftRouter.route('/get-shift').post(jwt(config), checkRole(["1", "2", "6"]), controller.getShift);
shiftRouter.route('/update-shift/:id').post(jwt(config), checkRole(["1", "2", "6"]), controller.updateShiftHandler);
shiftRouter.route('/show').post(jwt(config), checkRole(["1", "2", "6"]), controller.getShiftByName);
shiftRouter.route('/delete/:id').post(jwt(config), checkRole(["1", "2", "6"]), controller.destroyHandler);
shiftRouter.route('/exports').post(jwt(config), checkRole(["1", "2", "6"]),controller.exportToExcel);