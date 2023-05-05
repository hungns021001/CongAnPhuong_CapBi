import * as express from 'express';
import {Request, Response, NextFunction} from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
import multer from "multer";
const fs = require('fs');
import * as crypto from "crypto";
const { expressjwt: jwt } = require('express-jwt');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir ='./tmp/uploads/sanctions'
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


export const sanctionsRouter = express.Router();

/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 3 : P_C_T_P
 * @authorized {CheckRole} = 4 : C_S_K_V
 * @authorized {CheckRole} = 6 : admin
 */
sanctionsRouter.route('/create-sanctions-handler').post(jwt(config),upload, checkRole(["1","3", "4","6"]), controller.createSanctionsHandle);
sanctionsRouter.route('/get-sanctions').post(jwt(config), checkRole(["1","3","4","6"]), controller.getSanctions);
sanctionsRouter.route('/update-sanctions/:id').post(jwt(config),upload, checkRole(["1","3","4","6"]), controller.updateSanctionsHandle);
sanctionsRouter.route('/show').post(jwt(config), checkRole(["1","3", "4","6"]), controller.getSanctionsByName);
sanctionsRouter.route('/delete/:id').post(jwt(config), checkRole(["1","3","4","6"]), controller.destroyHandle);
sanctionsRouter.route('/exports').post(jwt(config), checkRole(["1","3","4","6"]), controller.exportToExcel);