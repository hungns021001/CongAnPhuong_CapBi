import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "../../config";
import { checkRole } from '../../middlewares/checkRole';
import multer from "multer";
const fs = require('fs');
import * as crypto from "crypto";
const { expressjwt: jwt } = require('express-jwt');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir ='./tmp/uploads/handlingonday'
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir)
    },

    filename: function (req, file, cb) {
        const randomString = crypto.randomBytes(3).toString('hex');
        const filename = `${randomString}-${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
})

const upload = multer({storage: storage}).array('images');

export const handlingondayRoutes = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 5 : C_S_T_T
 * @authorized {CheckRole} = 6 : admin
 */

handlingondayRoutes.route('/create-handle').post(jwt(config), upload, checkRole(["1", "5", "6"]), controller.createHandle);
handlingondayRoutes.route('/verify/:id').post(jwt(config), checkRole(["1", "5", "6"]), controller.verifyHandle);
handlingondayRoutes.route('/update/:id').post(jwt(config), upload, checkRole(["1", "5", "6"]), controller.updateHandle);
handlingondayRoutes.route('/delete/:id').post(jwt(config), checkRole(["1", "5", "6"]), controller.destroyHandle);
handlingondayRoutes.route('/show').post(jwt(config), checkRole(["1", "5", "6"]), controller.getHandlingDayByName);
handlingondayRoutes.route('/get-handle').post(jwt(config), checkRole(["1", "5", "6"]), controller.getHandling);
handlingondayRoutes.route('/exports').post(jwt(config), checkRole(["1", "5", "6"]), controller.exportToExcel);