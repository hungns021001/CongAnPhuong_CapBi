import * as express from 'express';
import {Request, Response, NextFunction} from 'express';
import * as controller from './controller';
import {jwt_config as config} from "./../../config";
import {checkRole} from '../../middlewares/checkRole';
import multer from "multer";
import * as crypto from "crypto";
import fs from "fs";

const {expressjwt: jwt} = require('express-jwt');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'tmp/uploads/accreditation';
        fs.mkdir(dir, {recursive: true}, (err) => {
            if (err) throw err;
            cb(null, dir);
        });
    },

    filename: function (req, file, cb) {
        const {dateSend, licensePlates, violation, receiver, finePaymentDate, images} =
        req.body;
        console.log("imagessss",images);
        console.log("receiver", receiver);
        
        
        const randomString = crypto.randomBytes(3).toString('hex');
        const filename = `${randomString}-${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
})

const fileFilter = (req: Request, file: any, cb: any) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG and PNG files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    // limits: {fileSize: 10000000},
    // fileFilter: fileFilter
}).array('images[]');


export const accreditationRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 5 : C_S_T_T
 * @authorized {CheckRole} = 6 : admin
 */
accreditationRouter.route('/create-accreditation').post(jwt(config), upload, checkRole(["1", "5", "6"]), controller.createVehicleAccreditation);
accreditationRouter.route('/get-accreditation').post(jwt(config), checkRole(["5", "6"]), controller.getVehicleAccreditation);
accreditationRouter.route('/update-accreditation/:id').post(jwt(config), upload, checkRole(["5", "6"]), controller.updateVehicleAccreditation);
accreditationRouter.route('/delete/:id').post(jwt(config), checkRole(["5", "6"]), controller.destroyAccreditation);
accreditationRouter.route('/show').post(jwt(config), checkRole(["5", "6"]), controller.getVehicleAccreditationByReceiver);
accreditationRouter.route('/exports').post(jwt(config), checkRole(["5", "6"]), controller.exportToExcel);