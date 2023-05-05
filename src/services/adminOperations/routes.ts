import * as express from "express";
import {jwt_config as config} from "../../config";
import {checkRole} from "../../middlewares/checkRole";
import * as controller from "./controller";
const {expressjwt: jwt} = require("express-jwt");

export const adminOperationRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {checkRole} = 6 : admin
 */
adminOperationRouter.route('/accounts').post(jwt(config), checkRole(["1", "6"]), controller.createAccount);
adminOperationRouter.route('/accounts').get(jwt(config), (checkRole(["1", "6"])), controller.getAccount);
adminOperationRouter.route('/accounts/:id').get(jwt(config), (checkRole(["1", "6"])), controller.getAccountById);
adminOperationRouter.route('/accounts/:id').patch(jwt(config), checkRole(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]), controller.updateAccount);
adminOperationRouter.route('/accounts/:id').delete(jwt(config), checkRole(["1", "6"]), controller.destroyAccount);
adminOperationRouter.route('/accounts-search').get(jwt(config), checkRole(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]), controller.searchAccountsByFullName);
