import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Account } from "../../entity/Account";

export const getfullname = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const accountRepository = getRepository(Account)
        const _list = await accountRepository
        .createQueryBuilder("account")
        .select("account.FullName")
        .getMany()
        
        if (_list.length === 0) {
            return res.status(404).json({
                'error_code': 4,
                'msg': 'Data Not Found',
            });
        }

        return res.status(200).json({
            'error_code': 0,
            'msg': 'success',
             data: _list
        });
    } catch (err: any) {
        console.error("get-fullname: ", err);
        res.status(500).send({
            msg: "Get internal server error in get fullname",
        });
    }
};
