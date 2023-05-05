import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const {expressjwt : jwt} = require('express-jwt');

export const nothandleRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_Pss
 * @authorized {CheckRole} = 5 : C_S_T_T
 * @authorized {CheckRole} = 6 : admin
 */
nothandleRouter.route('/create-nothandle').post(jwt(config), checkRole(["1","5","6"]), controller.createNotHandle);
nothandleRouter.route('/get-nothandle').post(jwt(config), checkRole(["1","5","6"]), controller.getNotHandle);
nothandleRouter.route('/update-nothandle/:id').post(jwt(config), checkRole(["1","5","6"]), controller.updateNotHandle);
nothandleRouter.route('/delete/:id').post(jwt(config), checkRole(["1","5","6"]), controller.destroyHandler);
nothandleRouter.route('/show').post(jwt(config), checkRole(["1","5","6"]), controller.getnothandleByAddress);
nothandleRouter.route('/exports').post(jwt(config),checkRole(["1","5","6"]),controller.exportToExcel);