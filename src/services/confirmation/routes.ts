import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const { expressjwt: jwt } = require('express-jwt');

export const confirmationRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 2 : N_T_H
 * @authorized {CheckRole} = 6 : admin
 */
confirmationRouter.route('/get-confirmation').post(jwt(config), checkRole(["1", "2", "6"]), controller.getConfirmation);
confirmationRouter.route('/create-confirmation-handler').post(jwt(config), checkRole(["1", "2", "6"]), controller.createConfirmationHandler);
confirmationRouter.route('/show').post(jwt(config), checkRole(["1", "2", "6"]), controller.getConfirmationByName);
confirmationRouter.route('/update-confirmation/:id').post(jwt(config), checkRole(["1", "2", "6"]), controller.updateConfirmationHandler);
confirmationRouter.route('/delete/:id').post(jwt(config), checkRole(["1", "2", "6"]), controller.destroyHandler);
confirmationRouter.route('/exports').post(jwt(config), checkRole(["1", "2", "6"]), controller.exportToExcel);