import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const { expressjwt: jwt } = require('express-jwt');

export const trackingRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {checkRole} = 2 : N_T_H 
 * @authorized {CheckRole} = 6 : admin
 */
trackingRouter.route('/create-tracker-handler').post(jwt(config), checkRole(["1", "2", "6"]), controller.createDocumentTrackerHandle);
trackingRouter.route('/get-tracker').post(jwt(config), checkRole(["1", "2", "6"]), controller.getDocumentTracking);
trackingRouter.route('/update-tracker/:id').post(jwt(config), checkRole(["1", "2", "6"]), controller.updateDocumentTrackerHandle);
trackingRouter.route('/show').post(jwt(config), checkRole(["1", "2", "6"]), controller.getDocumentTrackingByName);
trackingRouter.route('/delete/:id').post(jwt(config), checkRole(["1", "2", "6"]), controller.destroyHandle);
trackingRouter.route('/exports').post(jwt(config), checkRole(["1", "2", "6"]), controller.exportToExcel);
