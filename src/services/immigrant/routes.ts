import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const { expressjwt: jwt } = require('express-jwt');

export const immigrantRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 2 : N_T_H
 * @authorized {CheckRole} = 6 : admin
 */
immigrantRouter.route('/create-immigrant-handler').post(jwt(config), checkRole(["1", "2", "6"]), controller.createImmigrantHandler);
immigrantRouter.route('/get-immigrant').post(jwt(config), checkRole(["1", "2", "6"]), controller.getImmigrant);
immigrantRouter.route('/update-immigrant/:id').post(jwt(config), checkRole(["1", "2", "6"]), controller.updateImmigrantHandler);
immigrantRouter.route('/show').post(jwt(config), checkRole(["1", "2", "6"]), controller.getImmigrantByName);
immigrantRouter.route('/delete/:id').post(jwt(config), checkRole(["1", "2", "6"]), controller.destroyHandler);
immigrantRouter.route('/exports').post(jwt(config), checkRole(["1", "2", "6"]), controller.exportToExcel);