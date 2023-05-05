import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const {expressjwt : jwt} = require('express-jwt');

export const trafficLockRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {checkRole} = 3 : P_C_T_P 
 * @authorized {checkRole} = 6 : admin
 */
trafficLockRouter.route('/create-handle').post(jwt(config), checkRole(["1","2","6"]), controller.createHandle);
trafficLockRouter.route('/get-traffic-lock').post(jwt(config),(checkRole(["1","2","6"])), controller.getTrafficLock);
trafficLockRouter.route('/update-handle/:id').post(jwt(config), checkRole(["1","2","6"]), controller.updateHandle);
trafficLockRouter.route('/delete/:id').post(jwt(config), checkRole(["1","2","6"]), controller.destroyHandle);
trafficLockRouter.route('/show').post(jwt(config), checkRole(["1","2","6"]), controller.getSearch);
trafficLockRouter.route('/exports').post(jwt(config), checkRole(["1","2","6"]),controller.exportToExcel);