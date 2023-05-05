import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { WorkAssign } from "../../entity/WorkAssign";
import { Account } from "../../entity/Account";
import { CommentTask } from "../../entity/CommentTask";
import { getTimeDate, paginationHandle, totalPage,formatDay } from "../../libs/common/pagination";
import { MessageTaskCaptain } from "../../entity/MessageTaskCaptain";
import { MessageTaskPolice } from "../../entity/MessageTaskPolice";

export const assignTaskHandle = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const idAdmin = (req as any).auth.payload.id;
        const arrUser = new Array();
        arrUser.push(idAdmin);
        const { title, content, date, id } = req.body
        const assignRepository = getRepository(WorkAssign)
        const accountRepository = getRepository(Account)
        const _isCheck = await accountRepository
        .createQueryBuilder("account")
        .select()
        .whereInIds(id)
        .getRawMany();
        const _isCheckAdmin = await accountRepository
        .createQueryBuilder("account")
        .select()
        .whereInIds(idAdmin)
        .getRawMany();    

        if (_isCheck.length === 0  || _isCheckAdmin.length ===0) {
            return res.status(200).json({
                'error_code': 2,
                'msg': 'ID not found',
                 data: {
                    'list_data': []
                }
            });
        }
        arrUser.push(id);
        const task = new WorkAssign()
        task.title = title
        task.content = content,
        task.date = formatDay(date),
        task.accountId = JSON.stringify(arrUser)
        task.namePolice = _isCheck[0]['account_FullName']
        task.nameAdmin = _isCheckAdmin[0]['account_FullName']
        assignRepository.save(task);

        return res.status(200).json({
            'error_code': 0,
            'msg': 'success',
            data: task
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};

export const updateTaskHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const idAdmin = (req as any).auth.payload.id;
        const arrUser = new Array();
        arrUser.push(idAdmin);
        const taskRepository = getRepository(WorkAssign)
        const taskId = Number(req.params.id)
        const { 
            title,
            content,
            date,
            id} = req.body;

        const task = await taskRepository.findOneBy({Id: taskId})
        const accountRepository = getRepository(Account)
        const _isCheck = await accountRepository
            .createQueryBuilder("account")
            .select()
            .whereInIds(id)
            .getRawMany();
         const _isCheckAdmin = await accountRepository
            .createQueryBuilder("account")
            .select()
            .whereInIds(idAdmin)
            .getRawMany();    

        if (_isCheck.length === 0 || _isCheckAdmin.length ===0) {
            return res.status(200).json({
                'error_code': 2,
                'msg': 'ID not found',
                 data: {
                    
                    'list_data': []}
            });
        }
        arrUser.push(id);    
        if (task) {
            task.title = title
            task.content = content,
            task.date = formatDay(date),
            task.accountId = JSON.stringify(arrUser)
            task.namePolice = _isCheck[0]['account_FullName']
            task.nameAdmin = _isCheckAdmin[0]['account_FullName']
            taskRepository.save(task)

            return res.status(200).json({
                'error_code': 0,
                 message: 'Update successfully',
                 data: task
            });
        } else {
            return res.status(404).json({ message: "Task not found" });
        }
       
    } catch (err: any) {
        console.error("update passport: ", err);
        res.status(500).send({
            msg: "Get internal server error in update task",
        });
    }
};

export const destroyHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const taskRepository = getRepository(WorkAssign);
        const isCheck = await taskRepository.findOneBy({Id:  id })

        if (isCheck) {
            taskRepository.softDelete(id)

            return res.status(200).json({
                'error_code': 0,
                'msg': 'Deleted successfully',
            });
        } else {
            return res.status(404).json({
                'error_code': 2,
                'msg': 'ID not found',
            })
        }

    } catch (err: any) {
        console.error("delete-task: ", err);
        res.status(500).send({
            msg: "Get internal server error in delete handler",
        })
    }
}
export const completeTask = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = Number(req.params.id);
        const { complete } = req.body;
        const role_id = (req as any).auth.payload.role;
        const assignRepository = getRepository(WorkAssign);
        const messageCaptainRepository = getRepository(MessageTaskCaptain);
        const messagePoliceRepository = getRepository(MessageTaskPolice);
        const messageTaskCaptain = new MessageTaskCaptain();
        const messageTaskPolice = new MessageTaskPolice();

        if (
        ["1", "2", "3", "4", "5", "6"].includes(role_id)
        ) {
        const data = await assignRepository
            .createQueryBuilder("work_assign")
            .select()
            .where('work_assign."Id" = :idTask', { idTask: id })
            .andWhere('work_assign."deletedAt" IS NULL')
            .getMany();

        if (!data) {
            return res.status(400).json({
            error_code: 2,
            msg: "ID not found",
            data: {
                list_data: [],
            },
            });
        }

        if (Number(complete) === 1) {
            assignRepository.update(id, {
            active: complete,
            jobneeds: 0,
            });

            messageTaskCaptain.IdAdmin = Number(data[0]["accountId"][0]);
            messageTaskCaptain.message = `Công việc (${data[0]["title"]}) mà bạn giao cho Cán bộ:(${data[0]["namePolice"]}) đã hoàn thành!`;
            messageTaskCaptain.link_task = `/api/assign/getreceived-task/${data[0]["Id"]}`;
            messageTaskCaptain.datetime = getTimeDate();

            messageTaskPolice.IdUser = Number(data[0]["accountId"][1]);
            messageTaskPolice.message = `Bạn đã hoàn thành công việc: (${data[0]["title"]})`;
            messageTaskPolice.link_task = `/api/assign/getreceived-task/${data[0]["Id"]}`;
            messageTaskPolice.datetime = getTimeDate();

            messagePoliceRepository.save(messageTaskPolice);
            messageCaptainRepository.save(messageTaskCaptain);
        } else if (Number(complete) === 0) {
            assignRepository.update(id, {
            active: complete,
            jobneeds: 1,
            });

            messageTaskCaptain.IdAdmin = Number(data[0]["accountId"][0]);
            messageTaskCaptain.message = `Công việc (${data[0]["title"]}) mà bạn giao cho Cán bộ:(${data[0]["namePolice"]}) đã bị hủy hoàn thành!`;
            messageTaskCaptain.link_task = `/api/assign/getreceived-task/${data[0]["Id"]}`;
            messageTaskCaptain.datetime = getTimeDate();

            messageTaskPolice.IdUser = Number(data[0]["accountId"][1]);
            messageTaskPolice.message = `Bạn đã hủy hoàn thành công việc: (${data[0]["title"]})`;
            messageTaskPolice.link_task = `/api/assign/getreceived-task/${data[0]["Id"]}`;
            messageTaskPolice.datetime = getTimeDate();

            messagePoliceRepository.save(messageTaskPolice);
            messageCaptainRepository.save(messageTaskCaptain);
        } else {
            return res.status(400).json({
            error_code: 3,
            msg: "Error! An error occurred. Please try again later",
            });
        }

        return res.status(200).json({
            error_code: 0,
            msg: "Update status of task successfully",
        });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};

export const receivedTask = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const Id = Number(req.params.id);
        const { received } = req.body;
        const role_id = (req as any).auth.payload.role;
        const assignRepository = getRepository(WorkAssign);
        const messageCaptainRepository = getRepository(MessageTaskCaptain);
        const messagePoliceRepository = getRepository(MessageTaskPolice);

        const messageTaskCaptain = new MessageTaskCaptain();
        const messageTaskPolice = new MessageTaskPolice();

        if (["1", "2", "3", "4", "5", "6"].includes(role_id)) {
        const data = await assignRepository
            .createQueryBuilder("work_assign")
            .select()
            .where('work_assign."Id" = :idTask', { idTask: Id })
            .andWhere('work_assign."deletedAt" IS NULL')
            .getMany();

        if (!data || data.length === 0) {
            return res.status(400).json({
            error_code: 2,
            msg: "ID not found",
            data: {
                list_data: [],
            },
            });
        }

        if (Number(received) === 1) {
            assignRepository.update(Id, {
            active: 0,
            jobneeds: received,
            received: received,
            });

            messageTaskCaptain.IdAdmin = Number(data[0].accountId[0]);
            messageTaskCaptain.message = `Công việc (${data[0].title}) mà bạn giao cho Cán bộ:(${data[0].namePolice}) đã được nhận!`;
            messageTaskCaptain.link_task = `/api/assign/getreceived-task/${data[0].Id}`;
            messageTaskCaptain.datetime = getTimeDate();

            messageTaskPolice.IdUser = Number(data[0].accountId[1]);
            messageTaskPolice.message = `Bạn đã nhận công việc: (${data[0].title})`;
            messageTaskPolice.link_task = `/api/assign/getreceived-task/${data[0].Id}`;
            messageTaskPolice.datetime = getTimeDate();

            messagePoliceRepository.save(messageTaskPolice);
            messageCaptainRepository.save(messageTaskCaptain);
        } else if (Number(received) === 0) {
            assignRepository.update(Id, {
            active: received,
            jobneeds: received,
            received: received,
            });

            messageTaskCaptain.IdAdmin = Number(data[0].accountId[0]);
            messageTaskCaptain.message = `Công việc (${data[0].title}) mà bạn giao cho Cán bộ:(${data[0].namePolice}) đã bị hủy nhận!`;
            messageTaskCaptain.link_task = `/api/assign/getreceived-task/${data[0].Id}`;
            messageTaskCaptain.datetime = getTimeDate();

            messageTaskPolice.IdUser = Number(data[0].accountId[1]);
            messageTaskPolice.message = `Bạn đã hủy nhận công việc: (${data[0].title})`;
            messageTaskPolice.link_task = `/api/assign/getreceived-task/${data[0].Id}`;
            messageTaskPolice.datetime = getTimeDate();

            messagePoliceRepository.save(messageTaskPolice);
            messageCaptainRepository.save(messageTaskCaptain);
        } else {
            return res.status(400).json({
            error_code: 3,
            msg: "Error! An error occurred. Please try again later",
            });
        }
            return res.status(200).json({
                'error_code': 0,
                'msg': 'Update status of task successfully',
            });
            }
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};
export const statusTask = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const assignRepository = getRepository(WorkAssign)
        const _list = await assignRepository
        .createQueryBuilder('work_assign')
        .select(["COUNT('Id') as total,SUM(active) as active,SUM(received) as received, SUM(jobneeds) as jobneeds"])
        .where('work_assign.deletedAt is null')
        .getRawMany()
        if (_list.length===0) {
            return res.status(400).json({
                'error_code': 2,
                'msg': 'Data not found',
                data : {
                    
                    'list_data': []}
            });
        }
        return res.status(200).json({
            'error_code': 0,
            'msg': 'Success!',
            data: _list 
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};
export const commentTask = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = (req as any).auth.payload.id;
        const role_id = (req as any).auth.payload.role;

        const {
            idTask,
            comment
        } = req.body;

        const assignRepository = getRepository(WorkAssign);
        const commentTaskRepository = getRepository(CommentTask);
        const messageCaptainRepository = getRepository(MessageTaskCaptain);
        const messagePoliceRepository = getRepository(MessageTaskPolice);

        const _list = await assignRepository.createQueryBuilder('work_assign')
            .select()
            .where('work_assign."accountId" @> :idUser::jsonb', { idUser: JSON.stringify(id) })
            .andWhere('work_assign."Id" = :taskId', { taskId: idTask })
            .andWhere('work_assign.deletedAt is null')
            .getMany();

        if (_list.length === 0) {
            return res.status(400).json({
                'error_code': 2,
                'msg': 'ID not found',
                data: {
                    'list_data': []
                }
            });
        }

        const commentTask = new CommentTask();
        commentTask.idTask = idTask;
        commentTask.idUser = id;
        commentTask.comment = comment;
        commentTask.time = getTimeDate();

        let messageTask: MessageTaskCaptain | MessageTaskPolice;
        let fullName: string;
        let linkTask: string;

        if (['1', '2', '3', '4', '5', '6'].includes(role_id)) {
            fullName = _list[0]['nameAdmin'];
            messageTask = new MessageTaskPolice();
            messageTask.IdUser = Number(_list[0]['accountId'][1]);
            messageTask.message = `Cán bộ:(${_list[0]['namePolice']}) đã bình luận trong phần công việc: (${_list[0]['title']})`;
            linkTask = `/api/assign/getreceived-task/${_list[0]['Id']}`;
            messageTask.link_task = linkTask;
            messageTask.datetime = getTimeDate();
            messagePoliceRepository.save(messageTask);
        } else {
            fullName = _list[0]['namePolice'];
            messageTask = new MessageTaskCaptain();
            messageTask.IdAdmin = Number(_list[0]['accountId'][0]);
            messageTask.message = `Cán bộ:(${_list[0]['nameAdmin']}) đã bình luận trong phần công việc: (${_list[0]['title']})`;
            linkTask = `/api/assign/getreceived-task/${_list[0]['Id']}`;
            messageTask.link_task = linkTask;
            messageTask.datetime = getTimeDate();
            messageCaptainRepository.save(messageTask);
        }

        commentTask.fullName = fullName;
        commentTaskRepository.save(commentTask);  
        return res.status(200).json({
            'error_code': 0,
            'msg': 'Success!',
            data: commentTask
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};
export const getCommentTask = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const Id = Number(req.params.idTask)
            const commentTaskRepository = getRepository(CommentTask);
            const _list = await commentTaskRepository
            .createQueryBuilder('comment_task')
            .select()
            .where('comment_task.idTask = :taskID',{taskID:Id})
            .andWhere('comment_task.deletedAt is null')
            .orderBy('comment_task.idTask','ASC')
            .getMany()
        if (_list.length===0) {
            return res.status(400).json({
                'error_code': 2,
                'msg': 'ID not found',
                data : {
                    
                    'list_data': []}
            });
        }
        return res.status(200).json({
            'error_code': 0,
            'msg': 'Success!',
            data: _list
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};
export const getAccountUser = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
            const accountRepository = getRepository(Account);
            const _list = await accountRepository
            .createQueryBuilder('account')
            .select()
            .orderBy('account.Id','ASC')
            .getMany()
        if (_list.length===0) {
            return res.status(400).json({
                'error_code': 2,
                'msg': 'ID not found',
                data : {
                    
                    'list_data': []}
            });
        }
        return res.status(200).json({
            'error_code': 0,
            'msg': 'Success!',
            data: _list
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};
export const getReceivedTask = async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const role_id = (req as any).auth.payload.role;
      const idUser = (req as any).auth.payload.id;
      const assignRepository = getRepository(WorkAssign);
  
      let _list: any[];
  
      if (Number(role_id) === 1) {
        _list = await assignRepository
          .createQueryBuilder('work_assign')
          .select()
          .andWhere('work_assign."deletedAt" IS NULL')
          .getMany();
      } else {
        _list = await assignRepository
          .createQueryBuilder('work_assign')
          .select()
          .where('work_assign."accountId" @> :idUser::jsonb', { idUser: JSON.stringify(idUser) })
          .andWhere('work_assign."deletedAt" IS NULL')
          .getMany();
      }
  
      if (_list.length === 0) {
        return res.status(400).json({
          error_code: 2,
          msg: 'ID not found',
          data: {
            list_data: [],
          },
        });
      }
  
      return res.status(200).json({
        error_code: 0,
        msg: 'Success!',
        data: _list,
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).send({
        msg: 'Get internal server error',
      });
    }
  };

export const getMessageTask = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const idUser = (req as any).auth.payload.id;
        const role_id = (req as any).auth.payload.role;

        let messageRepository;
        let queryBuilder;
        if (['1', '2', '3', '4', '5', '6'].includes(role_id)) {
            messageRepository = getRepository(MessageTaskCaptain);
            queryBuilder = messageRepository.createQueryBuilder('message_task_captain');
            queryBuilder.where('message_task_captain."IdAdmin" = :idUser', {idUser: idUser});
            queryBuilder.andWhere('message_task_captain."deletedAt" IS NULL');
        } else {
            messageRepository = getRepository(MessageTaskPolice);
            queryBuilder = messageRepository.createQueryBuilder('message_task_police');
            queryBuilder.where('message_task_police."IdUser" = :idUser', {idUser: idUser});
            queryBuilder.andWhere('message_task_police."deletedAt" IS NULL');
        }
        const _list = await queryBuilder.getMany();

        if (_list.length === 0) {
            return res.status(400).json({
                'error_code': 2,
                'msg': 'ID not found',
                data: {
                    'list_data': []
                }
            });
        }

        const page = Number(req.query.page) || 1;
        const list_data = paginationHandle(page, _list);
        const pageTotal = totalPage(_list.length);
        return res.status(200).json({
            'error_code': 0,
            'msg': 'Success!',
            data: {
                "list_data": list_data,
                pageTotal: pageTotal
            }
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};
export const getDetailTask = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const idTask = Number(req.params.idTask);
        const role_id = (req as any).auth.payload.role;
            const assignRepository = getRepository(WorkAssign);
            const _list = await assignRepository
            .createQueryBuilder('work_assign')
            .select()
            .where('work_assign."Id" = :idTask',{idTask:idTask})
            .andWhere('work_assign."deletedAt" IS NULL')
            .getMany()
            if (_list.length===0) {
                return res.status(400).json({
                    'error_code': 2,
                    'msg': 'ID not found',
                    data : {
                        
                        'list_data': []}
                });
            }
            return res.status(200).json({
                'error_code': 0,
                'msg': 'Success!',
                data: _list
            });    
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};
export const delCommentTask = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const idUser = (req as any).auth.payload.id;
        const idComment = Number(req.params.id);
        const commentRepository = getRepository(CommentTask);
        const isCheck = await commentRepository
        .createQueryBuilder('comment_task')
        .select()
        .where('comment_task."idUser" = :idUser',{idUser:idUser})
        .andWhere('comment_task."id" =:idComment',{idComment:idComment})
        .getRawOne()
        if (isCheck.length !== 0) {
            commentRepository.softDelete(idComment)
            return res.status(200).json({
                'error_code': 0,
                'msg': 'Deleted successfully',
            });
        } else {
            return res.status(404).json({
                'error_code': 2,
                'msg': 'You can not delete this message!',
            })
        }

    } catch (err: any) {
        console.error("delete-task: ", err);
        res.status(500).send({
            msg: "Get internal server error in delete handler",
        })
    }
}
export const delMessageTask = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const idUser = (req as any).auth.payload.id;
        const role_id = (req as any).auth.payload.role; 
        const idMessage = Number(req.params.id);
        const messageRepository = getRepository(MessageTaskCaptain);      
      
        let isCheck;
        if (["1", "2", "3", "4", "5", "6"].includes(role_id)) {
          isCheck = await messageRepository
            .createQueryBuilder('message_task_captain')
            .select()
            .where('message_task_captain."IdAdmin" = :idUser', {idUser})
            .andWhere('message_task_captain."Id" = :idMessage', {idMessage})
            .getRawOne();
        } else {
          isCheck = await messageRepository
            .createQueryBuilder('message_task_police')
            .select()
            .where('message_task_police."IdUser" = :idUser', {idUser})
            .andWhere('message_task_police."Id" = :idMessage', {idMessage})
            .getRawOne();
        }
      
        if (isCheck) {
          await messageRepository.softDelete(idMessage);
          return res.status(200).json({
            error_code: 0,
            msg: 'Deleted successfully',
          });
        } else {
          return res.status(404).json({
            error_code: 2,
            msg: 'You can not delete this message!',
          })
        }
      } catch (err) {
        console.error('delete-task: ', err);
        res.status(500).send({
          msg: 'Get internal server error in delete handler',
        });
      }
}
export const getSearch = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const idUser = (req as any).auth.payload.id;
        const { 
            date,
            content,
            idTask } = req.body
        const assignRepository = getRepository(WorkAssign)
        const search = await assignRepository
            .createQueryBuilder('work_assign')
            .select()

        if (date) {
            search.where("work_assign.date =:date", { date: `${formatDay(date)}` })
            .andWhere('work_assign."accountId" @> :idUser::jsonb', { idUser: JSON.stringify(idUser) })
            .andWhere('work_assign.deletedAt is null')
        }
        if (content) {
            search.where("work_assign.content ILIKE :content", { content: `%${content}%` })
            .andWhere('work_assign."accountId" @> :idUser::jsonb', { idUser: JSON.stringify(idUser) })
            .andWhere('work_assign.deletedAt is null')
        }
        if (idTask) {
            search.where("work_assign.Id = :idTask", { idTask: Number(idTask) })
            .andWhere('work_assign."accountId" @> :idUser::jsonb', { idUser: JSON.stringify(idUser) })
            .andWhere('work_assign.deletedAt is null')
        }
        const _data = await search.orderBy("work_assign.Id", "ASC")
            .getMany()

        if (_data) {
            const page = Number(req.query.page) || 1
            const list_data = paginationHandle(page, _data)
            const total = totalPage(_data.length)

            return res.status(200).json({
                'error_code': 0,
                'msg': 'success',
                data: {
                    'list_data': list_data,
                    'totalPage': total
                }
            });
        } else {
            return res.status(404).json({
                'error_code': 2,
                'msg': 'Task not found',
            })
        }
    } catch (err: any) {
        console.error("get task by name: ", err);
        res.status(500).send({
            msg: "Get internal server error in get assign task",
        });
    }
};
