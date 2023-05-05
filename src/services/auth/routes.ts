import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const {expressjwt : jwt} = require('express-jwt');

export const authRouter = express.Router();
/*
* @Authorized: {checkRole} = 6 : admin
*/

authRouter.route('/create-user-handler').post(jwt(config),checkRole(["6"]),controller.createUserHandler);
authRouter.route('/login-handle').post(controller.loginUserHandler);

