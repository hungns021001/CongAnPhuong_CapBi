import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const { expressjwt: jwt } = require('express-jwt');

export const statusBookRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 2 : N_T_H
 * @authorized {CheckRole} = 6 : admin
 */
statusBookRouter.route('/create-status-book-handler').post(jwt(config), checkRole(["1", "2", "6"]), controller.createStatusBookHandler);
statusBookRouter.route('/get-status-book').post(jwt(config), checkRole(["1", "2", "6"]), controller.getStatusBook);
statusBookRouter.route('/update-status-book/:id').post(jwt(config), checkRole(["1", "2", "6"]), controller.updateStatusBookHandler);
statusBookRouter.route('/show').post(jwt(config), checkRole(["1", "2", "6"]), controller.getStatusBookByName);
statusBookRouter.route('/delete/:id').post(jwt(config), checkRole(["1", "2", "6"]), controller.destroyHandler);
statusBookRouter.route('/exports').post(jwt(config), checkRole(["1", "2", "6"]), controller.exportToExcel);