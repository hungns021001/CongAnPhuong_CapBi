import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const {expressjwt : jwt} = require('express-jwt');

export const roleRouter = express.Router();
/**
 * @authorized {CheckRole} = 6 : admin
 */
roleRouter.route('/get-role').post(jwt(config),checkRole(["6"]),controller.getRole);
