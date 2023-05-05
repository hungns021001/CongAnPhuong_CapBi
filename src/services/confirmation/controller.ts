import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { IdentityConfirmation } from "../../entity/IdentityConfirmation";
import { formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const Excel = require('exceljs');

export const createConfirmationHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { date,
            fullName,
            gender,
            birthday,
            staying,
            grantReason,
            verifier,
            leaderSign } = req.body;

        const confirmationRepository = getRepository(IdentityConfirmation)
        let confirmation = new IdentityConfirmation()
        confirmation.Date = formatDay(date);
        confirmation.FullName = fullName;
        confirmation.Gender = gender;
        confirmation.Birthday = formatDay(birthday);
        confirmation.Staying = staying;
        confirmation.GrantReason = grantReason;
        confirmation.Verifier = verifier;
        confirmation.LeaderSign = leaderSign;

        confirmationRepository.save(confirmation);

        return res.json({
            'error_code': 0,
            'msg': 'success',
            data: confirmation
        });
    } catch (err: any) {
        console.error("create-identity-confirmation: ", err);
        res.status(500).send({
            msg: "Get internal server error in create identity confirmation handler",
        });
    }
};

export const getConfirmation = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const confirmationRepository = getRepository(IdentityConfirmation)
        const _list = await confirmationRepository
            .createQueryBuilder("identity_confirmation")
            .select()
            .orderBy("identity_confirmation.Id", "DESC")
            .getMany()

        if (_list.length === 0) {
            return res.status(200).json({
                'error_code': 4,
                'msg': 'Data Not Found',
                data: {
                    'list_data': []
                }
            });
        }
        const page = Number(req.query.page) || 1
        const list_data = paginationHandle(page, _list)
        const total = totalPage(_list.length)

        return res.status(200).json({
            'error_code': 0,
            'msg': 'success',
            data: {
                'list_data': list_data,
                'totalPage': total
            }
        });
    } catch (err: any) {
        console.error("get-confirmation: ", err);
        res.status(500).send({
            msg: "Get internal server error in get confirmation",
        });
    }
};

export const getConfirmationByName = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { date,
            name,
            birthday,
            staying,
            grantReason,
            verifier,
            leaderSign,
            gender } = req.body
        const confirmationRepository = getRepository(IdentityConfirmation)
        const search = await confirmationRepository
            .createQueryBuilder('identity_confirmation')
            .select()

        if (date) {
            search.where("identity_confirmation.Date =:date", { date: `${formatDay(date)}` })
        }
        if (name) {
            search.where("identity_confirmation.FullName ILIKE :name", { name: `%${name}%` })
        }
        if (birthday) {
            search.where("identity_confirmation.Birthday =:birthday", { birthday: `${formatDay(birthday)}` })
        }
        if (staying) {
            search.where("identity_confirmation.Staying ILIKE :staying", { staying: `%${staying}%` })
        }
        if (grantReason) {
            search.where("identity_confirmation.GrantReason ILIKE :grantReason", { grantReason: `%${grantReason}%` })
        }
        if (verifier) {
            search.where("identity_confirmation.Verifier ILIKE :verifier", { verifier: `%${verifier}%` })
        }
        if (leaderSign) {
            search.where("identity_confirmation.LeaderSign ILIKE :leaderSign", { leaderSign: `%${leaderSign}%` })
        }
        if (gender) {
            search.where("identity_confirmation.Gender =:gender", { gender: `${gender}` })
        }

        const _data = await search.orderBy("identity_confirmation.Id", "ASC")
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
                'msg': 'Identity confirmation not found',
            })
        }
    } catch (err: any) {
        console.error("get identity confirmation by name: ", err);
        res.status(500).send({
            msg: "Get internal server error in get identity confirmation",
        });
    }
};

export const updateConfirmationHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const confirmationRepository = getRepository(IdentityConfirmation)
        const confirmationId = Number(req.params.id)
        const { date,
            fullName,
            gender,
            birthday,
            staying,
            grantReason,
            verifier,
            leaderSign } = req.body;

        const confirmation = await confirmationRepository.findOneBy({ id: confirmationId })

        if (confirmation) {
            confirmation.Date = formatDay(date);
            confirmation.FullName = fullName;
            confirmation.Gender = gender;
            confirmation.Birthday = formatDay(birthday);
            confirmation.Staying = staying;
            confirmation.GrantReason = grantReason;
            confirmation.Verifier = verifier;
            confirmation.LeaderSign = leaderSign;

            confirmationRepository.save(confirmation)

            return res.status(200).json({
                'error_code': 0,
                message: 'Update successfully',
                data: confirmation
            });
        } else {
            return res.status(404).json({ message: "Identity confirmation not found" });
        }

    } catch (err: any) {
        console.error("update identity confirmation: ", err);
        res.status(500).send({
            msg: "Get internal server error in update identity confirmation",
        });
    }
};

export const destroyHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const passportRepository = getRepository(IdentityConfirmation);
        const isCheck = await passportRepository.findOneBy({ id: id })

        if (isCheck) {
            passportRepository.delete(id)

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
        console.error("delete-identity-confirmation: ", err);
        res.status(500).send({
            msg: "Get internal server error in delete identity confirmation",
        });
    }
};
export const exportToExcel = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { startDay, endDay } = req.query
        if (startDay && endDay) {
            const formatStartDay = formatDay(startDay)
            const formatEndDay = formatDay(endDay)
            const confirmationRepository = getRepository(IdentityConfirmation)
            const items = await confirmationRepository
                .createQueryBuilder("identity_confirmation")
                .select()
                .where("identity_confirmation.deletedAt is null")
                .andWhere("identity_confirmation.createdAt >= :formatStartDay ", { formatStartDay })
                .andWhere("identity_confirmation.createdAt <= :formatEndDay ", { formatEndDay })
                .orderBy("identity_confirmation.id", "DESC")
                .getMany()
            if (items.length === 0) {
                return res.status(400).json({
                    error_code: "6",
                    message: "There is no data to export."
                })
            }
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet('Items');

            worksheet.columns = [
                { header: 'STT', key: 'id', width: 10, color: 'blue' },
                { header: 'NGÀY THÁNG NĂM', key: 'Date', width: 10, color: 'blue' },
                { header: 'HỌ VÀ TÊN NGƯỜI XIN XÁC NHẬN', key: 'FullName', width: 30 },
                { header: 'NGÀY SINH', key: 'Birthday', width: 10 },
                { header: 'HỘ KHẨU THƯỜNG TRÚ', key: 'Staying', width: 30 },
                { header: 'LÝ DO XÁC NHẬN', key: 'GrantReason', width: 30 },
                { header: 'CÁN BỘ XÁC NHẬN', key: 'Verifier', width: 30 },
                { header: 'CHỈ HUY KÝ', key: 'LeaderSign', width: 30 }
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    id: startNumber,
                    Date: item.Date,
                    FullName: item.FullName,
                    Birthday: item.Birthday,
                    Staying: item.Staying,
                    GrantReason: item.GrantReason,
                    Verifier: item.Verifier,
                    LeaderSign: item.LeaderSign
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const confirmationRepository = getRepository(IdentityConfirmation)
            const items = await confirmationRepository
                .createQueryBuilder("identity_confirmation")
                .select()
                .where("identity_confirmation.deletedAt is null")
                .orderBy("identity_confirmation.id", "DESC")
                .getMany()
            if (items.length === 0) {
                return res.status(400).json({
                    error_code: "6",
                    message: "There is no data to export."
                })
            }
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet('Items');

            worksheet.columns = [
                { header: 'STT', key: 'id', width: 10, color: 'blue' },
                { header: 'NGÀY THÁNG NĂM', key: 'Date', width: 10, color: 'blue' },
                { header: 'HỌ VÀ TÊN NGƯỜI XIN XÁC NHẬN', key: 'FullName', width: 30 },
                { header: 'NGÀY SINH', key: 'Birthday', width: 10 },
                { header: 'HỘ KHẨU THƯỜNG TRÚ', key: 'Staying', width: 30 },
                { header: 'LÝ DO XÁC NHẬN', key: 'GrantReason', width: 30 },
                { header: 'CÁN BỘ XÁC NHẬN', key: 'Verifier', width: 30 },
                { header: 'CHỈ HUY KÝ', key: 'LeaderSign', width: 30 }
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    id: startNumber,
                    Date: item.Date,
                    FullName: item.FullName,
                    Birthday: item.Birthday,
                    Staying: item.Staying,
                    GrantReason: item.GrantReason,
                    Verifier: item.Verifier,
                    LeaderSign: item.LeaderSign
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }

};
