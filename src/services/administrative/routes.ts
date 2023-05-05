import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const {expressjwt : jwt} = require('express-jwt');

export const administrativeRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {checkRole} = 3 : P_C_T_P 
 * @authorized {checkRole} = 6 : admin
 */
administrativeRouter.route('/create-administrative-handler').post(jwt(config), checkRole(["1","3","6"]), controller.createAdministrativeHandle);
administrativeRouter.route('/get-administrative').post(jwt(config),(checkRole(["1","3","6"])), controller.getAdministrative);
administrativeRouter.route('/update-administrative/:id').post(jwt(config), checkRole(["1","3","6"]), controller.updateAdministrativeHandle);
administrativeRouter.route('/delete/:id').post(jwt(config), checkRole(["1","3","6"]), controller.destroyHandle);
administrativeRouter.route('/show').post(jwt(config), checkRole(["1","3","6"]), controller.getAdministrativeByReceiver);
administrativeRouter.route('/exports').post(jwt(config), checkRole(["1","3","6"]),controller.exportToExcel);