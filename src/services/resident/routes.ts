import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
import multer from 'multer'
import path from 'path';
const { expressjwt: jwt } = require('express-jwt');

export const resident = express.Router();

/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 4 : C_S_K_V
 * @authorized {CheckRole} = 6 : admin
 */
resident.route('/create-resident-handler').post(jwt(config), checkRole(["1", "4", "6"]), controller.createResidentHandle);
resident.route('/get-resident').post(jwt(config), checkRole(["1", "4", "6"]), controller.getResident);
resident.route('/update-resident/:id').post(jwt(config), checkRole(["1", "4", "6"]), controller.updateResidentHandle);
resident.route('/show').post(jwt(config), checkRole(["1", "4", "6"]), controller.getResidentByName);
resident.route('/delete/:id').post(jwt(config), checkRole(["1", "4", "6"]), controller.destroyHandle);
resident.route('/exports').post(jwt(config), checkRole(["1", "4", "6"]), controller.exportToExcel);
