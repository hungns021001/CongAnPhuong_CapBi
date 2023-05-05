import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const {expressjwt : jwt} = require('express-jwt');

export const situationRouter = express.Router()

/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 2 : T_N_T_H
 * @authorized {CheckRole} = 3 : T_N_P_C_T_P
 * @authorized {CheckRole} = 4 : T_N_C_S_K_V
 * @authorized {CheckRole} = 5 : T_N_C_S_T_T
 * @authorized {CheckRole} = 6 : admin
 */

situationRouter.route('/create-handle').post(jwt(config), checkRole(["1","2","6"]), controller.createSituationHandle);
situationRouter.route('/get-situation').post(jwt(config), checkRole(["1","2","3","4","5","6","7"]), controller.getSituation);
situationRouter.route('/show').post(jwt(config), checkRole(["1","2","3","4","5","6","7"]), controller.getSerch);
situationRouter.route('/update-situation/:id').post(jwt(config), checkRole(["1","2","3","4","5","6"]), controller.updateSituation);
situationRouter.route('/delete/:id').post(jwt(config), checkRole(["1","2","3","4","5","6"]), controller.destroyHandle);
situationRouter.route('/move-to-handling/:id').post(jwt(config), checkRole(["1","2","3","4","5","6"]), controller.moveToHandlingBook);
situationRouter.route('/exports').post(jwt(config), checkRole(["1","2","3","4","5","6"]),controller.exportToExcel);


