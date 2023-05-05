import { NextFunction, Request, Response } from "express";
import { roleuser } from "../../entity/roleuser";
import { getRepository } from "typeorm";

export const getRole = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const roleRepository = getRepository(roleuser);
    const _role = await roleRepository
      .createQueryBuilder("roleuser")
      .select()
      .getRawMany();
    
      if (_role.length == 0) {
        return res.status(500).send({
            msg: "No data",
            'error_code': 1
        });
    }
    
    return res.status(200).send({
        'message': "success",
        "error_code" : 0,
        'data': _role
    });
  } catch (err: any) {
    console.error("get-role: ", err);
    res.status(500).send({
      msg: "Get internal server error in get role",
    });
  }
};