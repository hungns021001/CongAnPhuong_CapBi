import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const {expressjwt : jwt} = require('express-jwt');

export const userRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 2 : N_T_H
 * @authorized {CheckRole} = 3 : P_C_T_P
 * @authorized {CheckRole} = 4 : C_S_K_V
 * @authorized {CheckRole} = 5 : C_S_T_T
 * @authorized {CheckRole} = 6 : admin
 */
userRouter.route('/get-list-name').post(jwt(config), checkRole(["1","2","3","4","5","6"]), controller.getfullname);
