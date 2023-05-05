import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
import multer from "multer";
import crypto from "crypto";
import fs from "fs";
const { expressjwt: jwt } = require('express-jwt');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'tmp/uploads/handling';
        fs.mkdir(dir, {recursive: true}, (err) => {
            if (err) throw err;
            cb(null, dir);
        });
    },

    filename: function (req, file, cb) {
        const randomString = crypto.randomBytes(3).toString('hex');
        const filename = `${randomString}-${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
})

const upload = multer({
    storage: storage
}).array('images')

export const handlingRoutes = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 3 : P_C_T_P
 * @authorized {CheckRole} = 6 : admin
 */
handlingRoutes.route('/create-handle').post(jwt(config), upload, checkRole(["1", "3", "6"]), controller.createHandle);
handlingRoutes.route('/get-handling').post(jwt(config), checkRole(["1", "3", "6"]), controller.getHandling);
handlingRoutes.route('/update-handle/:id').post(jwt(config), upload, checkRole(["1", "3", "6"]), controller.updateHandle);
handlingRoutes.route('/show').post(jwt(config), checkRole(["1", "3", "6"]), controller.getHandlingByName);
handlingRoutes.route('/delete/:id').post(jwt(config), checkRole(["1", "3", "6"]), controller.destroyHandle);
handlingRoutes.route('/exports').post(jwt(config), checkRole(["1", "3", "6"]), controller.exportToExcel);