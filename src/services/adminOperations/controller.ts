import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {Account} from "../../entity/Account";
import * as bcrypt from "bcrypt";
import {paginationHandle, totalPage} from "../../libs/common/pagination";

export const createAccount = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const currentUserRoleId = (req as any).auth.payload.role;

        const id = Number(req.params.id)
        const {username, password, roleId, fullName} = req.body || {};

        const userRepository = getRepository(Account);
        const account = await userRepository.findOneBy({Username: username});
        if (account) {
            if (username === account.Username) {
                return res.status(400).send({error_code: 1, msg: "Username already exists."});
            }
        }

        const canCreateUser = currentUserRoleId === "1" && String(roleId) !== "6"
        const canCreateAdmin = currentUserRoleId === "6"

        if (canCreateUser || canCreateAdmin) {
            // Hash the password
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = new Account();
            user.Username = username;
            user.Password = hashedPassword;
            user.RoleId = roleId;
            user.FullName = fullName;
            await userRepository.save(user);

            return res.json({
                error_code: 0,
                msg: "success",
                data: user
            });
        }

        return res.status(401).send({msg: "You don't have permission to update the admin account!"})
    } catch (error: any) {
        console.error("Error in createAccount function: ", error);
        res.status(500).send({
            msg: "Internal server error occurred while creating the account."
        });
    }
};

export const getAccount = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const userRepository = getRepository(Account);

        const _list = await userRepository
            .createQueryBuilder("account")
            .select()
            .orderBy(`account.Id`, `DESC`)
            .getMany();

        if (_list.length === 0) {
            return res.status(404).json({
                'error_code': 4,
                'msg': "Data Not Found",
                data: {
                    list_data: []
                }
            })
        }

        const page = Number(req.query.page) || 1
        const list_data = paginationHandle(page, _list)
        const total = totalPage(_list.length)

        return res.status(200).json({
            'error_code': 0,
            'msg': 'success',
            data: {
                list_data: list_data,
                totalPage: total
            }
        })
    } catch (err: any) {
        console.log("get-account", err);
        res.status(500).send({
            msg: "Get internal server error in get account"
        })
    }
};

export const getAccountById = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id)

        const userRepository = getRepository(Account)

        const account = await userRepository.findOneBy({Id: id})

        if (!account) {
            return res.status(404).json({
                error_code: 4,
                msg: "Data not found",
                data: [],
            });
        }

        return res.status(200).json({
            error_code: 0,
            msg: "success",
            data: account
        })
    } catch
        (err: any) {
        console.log("get-account by id: ", err);
        res.status(500).send({
            msg: "Get internal server error in get account by id"
        })
    }
};

export const updateAccount = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const currentUserRoleId = (req as any).auth.payload.role;
        const currentUserId = (req as any).auth.payload.id;

        const id = Number(req.params.id)
        const {username, password, roleId, fullName} = req.body || {};

        const userRepository = getRepository(Account);
        const account = await userRepository.findOneBy({Id: id});
        if (!account) {
            return res.status(404).json({error_code: 4, msg: "Account not found", data: []});
        }
        if (username === account.Username) {
            return res.status(400).send({error_code: 1, msg: "Username already exists."});
        }

        const canUpdateUser = currentUserRoleId === "1" && String(roleId) !== "6" && account.RoleId !== "6"
        const canUpdateAdmin = currentUserRoleId === "6"
        const canUpdateProfile = ["2", "3", "4", "5", "7", "8", "9", "10"].includes(currentUserRoleId) && currentUserId === id && !req.body.hasOwnProperty('roleId');

        if (canUpdateUser || canUpdateAdmin || canUpdateProfile) {
            if (username) {
                account.Username = username;
            }

            if (password) {
                const salt = await bcrypt.genSalt();
                account.Password = await bcrypt.hash(password, salt);
            }

            if (fullName) {
                account.FullName = fullName;
            }

            await userRepository.save(account)

            return res.status(200).send({
                error_code: 0,
                msg: "Updated successfully",
                data: account
            })
        }

        return res.status(401).send({msg: "You don't have permission to update the admin account!"})
    } catch (err: any) {
        console.log("update account error: ", err);
        res.status(500).send({msg: "Internal server error in updating account"});
    }
};

export const destroyAccount = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const currentUserRoleId = (req as any).auth.payload.role;
        const currentUserId = (req as any).auth.payload.id;

        const id = Number(req.params.id)

        const userRepository = getRepository(Account)

        const account = await userRepository.findOneBy({Id: id});
        if (!account) {
            return res.status(404).json({error_code: 4, msg: "Account not found", data: []});
        }

        const canDeleteUser = currentUserRoleId === "1" && account.RoleId !== "6"
        const canDeleteAdmin = currentUserRoleId === "6" && currentUserId !== id

        if (canDeleteUser || canDeleteAdmin) {
            await userRepository.softDelete(id)

            return res.status(200).json({
                error_code: 0,
                msg: 'success',
            })
        }
        return res.status(401).send({msg: "You can't delete the account!"})
    } catch (err: any) {
        console.log("delete-account ", err);
        res.status(500).send({
            msg: "Get internal server error in delete account"
        })
    }
};

export const searchAccountsByFullName = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const name = req.query.name

        const userRepository = getRepository<Account>(Account)
        const account = userRepository.createQueryBuilder("account")

        if (name) {
            account.where("account.FullName ILIKE :name", {name: `%${name}%`})
        }

        const data = await account.orderBy("account", "ASC").getMany()

        if (data && data.length > 0) {
            const page = Number(req.query.page) || 1;
            const list = paginationHandle(page, data);
            const total = totalPage(data.length)

            return res.status(200).json({
                error_code: 0,
                msg: "success",
                data: {
                    list_data: list,
                    totalPage: total
                }
            })
        } else {
            return res.status(404).json({
                error_code: 4,
                msg: "No accounts found"
            })
        }
    } catch (error) {
        console.log("Error occurred while searching for accounts by full name: ", error);
        res.status(500).send({
            msg: "Internal server error occurred while searching for accounts by full name"
        })
    }
}
