import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { Account } from "../entity/Account";

export const checkRole = (roles) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = (req as any).auth.payload.role;

    //Get user role from the database
    const userRepository = getRepository(Account);
    const _user = await userRepository
      .createQueryBuilder("account")
      .select()
      .where("account.RoleId = :RoleId", { RoleId: id })
      .getOne();
    //Check if array of authorized roles includes the user's role
    if (roles.indexOf( _user?.RoleId) > -1) next();
    else res.status(401).send({msg :"You don't have permission to access data."});
  };
};