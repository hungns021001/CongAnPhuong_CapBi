import * as express from 'express';
import * as controller from './controller';
import { jwt_config as config } from "./../../config";
import { checkRole } from '../../middlewares/checkRole';
const {expressjwt : jwt} = require('express-jwt');
export const assignRouter = express.Router();
/**
 * @authorized {CheckRole} = 1 : T_C_A_P
 * @authorized {CheckRole} = 2 : N_T_H
 * @authorized {CheckRole} = 3 : P_C_T_P
 * @authorized {CheckRole} = 4 : C_S_K_V
 * @authorized {CheckRole} = 5 : C_S_T_T
 * @authorized {CheckRole} = 6 : admin
 */
assignRouter.route('/assign-handle').post(jwt(config), checkRole(["1","2","3","4","5","6"]),controller.assignTaskHandle);
assignRouter.route('/update-handle/:id').put(jwt(config), checkRole(["1","2","3","4","5","6"]),controller.updateTaskHandler);
assignRouter.route('/delete/:id').delete(jwt(config), checkRole(["1","2","3","4","5","6"]),controller.destroyHandler);
assignRouter.route('/complete-task/:id').patch(jwt(config), checkRole(['1','2','3','4','5','6','7','8','9','10']), controller.completeTask);
assignRouter.route('/received-task/:id').patch(jwt(config), checkRole(['1','2','3','4','5','6','8','9','10']), controller.receivedTask);
assignRouter.route('/getreceived-task').get(jwt(config), checkRole(['1','2','3','4','5','6','8','9','10']), controller.getReceivedTask);
assignRouter.route('/getreceived-task/:idTask').get(jwt(config), checkRole(['1','2','3','4','5','6','7','8','9','10']), controller.getDetailTask);
assignRouter.route('/status-task').get(jwt(config), checkRole(['1','2','3','4','5','6']), controller.statusTask);
assignRouter.route('/comment-task').post(jwt(config), checkRole(['1','2','3','4','5','6','7','8','9','10']), controller.commentTask);
assignRouter.route('/getcomment-task/:idTask').get(jwt(config), checkRole(['1','2','3','4','5','6','7','8','9','10']), controller.getCommentTask);
assignRouter.route('/getaccount-user').get(jwt(config), checkRole(['1','2','3','4','5','6']), controller.getAccountUser);
assignRouter.route('/getmessage-task').get(jwt(config), checkRole(['1','2','3','4','5','6','7','8','9','10']), controller.getMessageTask);
assignRouter.route('/delcomment-task/:id').delete(jwt(config), checkRole(['1','2','3','4','5','6','7','8','9','10']), controller.delCommentTask);
assignRouter.route('/delmessage-task/:id').delete(jwt(config), checkRole(['1','2','3','4','5','6','7','8','9','10']), controller.delMessageTask);
assignRouter.route('/show').get(jwt(config), checkRole(['1','2','3','4','5','6','7','8','9','10']), controller.getSearch);