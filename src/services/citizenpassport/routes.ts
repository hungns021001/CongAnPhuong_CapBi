import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const {expressjwt : jwt} = require('express-jwt');

export const passportRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 2 : N_T_H
 * @authorized {CheckRole} = 6 : admin
 */
passportRouter.route('/create-passport-handler').post(jwt(config), checkRole(["1","2","6"]), controller.createPassportHandler);
passportRouter.route('/get-passport').post(jwt(config), checkRole(["1","2","6"]), controller.getPassport);
passportRouter.route('/show').post(jwt(config), checkRole(["1","2","6"]), controller.getPassportByName);
passportRouter.route('/update-passport/:id').post(jwt(config), checkRole(["1","2","6"]), controller.updatePassportHandler);
passportRouter.route('/delete/:id').post(jwt(config), checkRole(["1","2","6"]), controller.destroyHandler);
passportRouter.route('/exports').post(jwt(config), checkRole(["1","2","6"]),controller.exportToExcel);