import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { jwt_config as config } from "../../config";
import { Account } from "../../entity/Account";
import { getRepository } from "typeorm";
import * as bcrypt from "bcrypt";

export const createUserHandler = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, password, roleId, fullname } = req.body;
    const userRepository = getRepository(Account);
    const _username = await userRepository
      .createQueryBuilder("account")
      .select()
      .where("account.Username = :Username", { Username: username })
      .getCount();
    if (_username >= 1) {
      return res.status(400).send({
        msg: "so many username find.",
        error_code: 1,
      });
    }
    const salt = await bcrypt.genSalt();
    const pass = await bcrypt.hash(password, salt);
    let user = new Account();
    user.Username = username;
    user.Password = pass;
    user.RoleId = roleId;
    user.FullName = fullname;
    userRepository.save(user);
    
    return res.json({
      error_code: 0,
      msg: "success",
    });
  } catch (err: any) {
    console.error("create-user-handler: ", err);
    res.status(500).send({
      msg: "Get internal server error in create user handler",
    });
  }
};
export const loginUserHandler = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, password } = req.body;
    // Validate username
    const userRepository = getRepository(Account);
    const _user = await userRepository
      .createQueryBuilder("account")
      .select()
      .where("account.Username = :Username", { Username: username })
      .getOne();

    if (!_user) {
      return res.status(400).send({
        msg: "This username doesn't exist.",
        error_code: 4,
      });
    }
    const getServerPass = _user.Password;
    const roleId = _user.RoleId;
    const fullname = _user.FullName;
    const checkPassword = bcrypt.compareSync(password, getServerPass);

    if (!checkPassword) {
      return res.status(400).send({
        msg: "Invalid password",
        error_code: 7,
      });
    }

    const accessToken = jwt.sign(
      {
        payload: {
          username: _user.Username,
          role: _user.RoleId,
          fullname: _user.FullName,
          id : _user.Id
        },
      },
      config.secret,
      {
        algorithm: "HS256",
      }
    );

    res.status(200).json({
      status: "success",
      username,
      roleId,
      fullname,
      accessToken,
    });
  } catch (err: any) {
    console.error("create-user-handler: ", err);
    res.status(500).send({
      msg: "Get internal server error in create user handler",
    });
  }
};
