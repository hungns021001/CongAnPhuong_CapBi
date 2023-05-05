import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const {expressjwt : jwt} = require('express-jwt');

export const dispatchRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {checkRole} = 2 : N_T_H 
 * @authorized {checkRole} = 6 : admin
 */
dispatchRouter.route('/create-dispatch-handler').post(jwt(config), checkRole(["1","2","6"]), controller.createDispatchHandle);
dispatchRouter.route('/get-dispatch').post(jwt(config),(checkRole(["1","2","6"])), controller.getDispatchBook);
dispatchRouter.route('/update-dispatch/:id').post(jwt(config), checkRole(["1","2","6"]), controller.updateDispatchHandle);
dispatchRouter.route('/delete/:id').post(jwt(config), checkRole(["1","2","6"]), controller.destroyHandle);
dispatchRouter.route('/show').post(jwt(config), checkRole(["1","2","6"]), controller.getDispatchByReceiver);
dispatchRouter.route('/exports').post(jwt(config), checkRole(["1","2","6"]),controller.exportToExcel);