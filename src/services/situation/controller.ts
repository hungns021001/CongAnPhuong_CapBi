import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { SituationOfDay } from "../../entity/SituationOfDay";
import { checkDay, formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
import { HandlingViolations } from "../../entity/Handling";
const Excel = require('exceljs');
const moment = require("moment");

export const createSituationHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date,
            forceOnDuty,
            caseName,
            location,
            content,
            receive,
            custody,
            returns,
            handOver } = req.body
        const date_create = new Date();
        const someDate = moment(date_create).format("YYYY-MM-DD HH:mm:ss");
        const situationRepo = getRepository(SituationOfDay)
        let situation = new SituationOfDay()
        situation.Date = formatDay(date)
        situation.ForceOnDuty = forceOnDuty,
            situation.CaseName = caseName,
            situation.Location = location,
            situation.Content = content,
            situation.Receive = receive,
            situation.Custody = custody,
            situation.Returns = returns,
            situation.HandOver = handOver
        situation.created_at = someDate

        situationRepo.save(situation)

        return res.status(200).json({
            'error_code': 0,
            'msg': 'success',
            data: situation
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
}

export const getSituation = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const situationRepo = getRepository(SituationOfDay);
        const _list = await situationRepo
            .createQueryBuilder("situation_of_day")
            .select()
            .orderBy("situation_of_day.Id", "DESC")
            .getMany();

        if (_list.length === 0) {
            return res.status(200).json({
                error_code: 4,
                msg: "Data Not Found",
                data: {
                    list_data: [],
                },
            });
        }
        const page = Number(req.query.page) || 1;
        const list_data = paginationHandle(page, _list);
        const totalold = totalPage(_list.length);

        return res.status(200).json({
            error_code: 0,
            msg: "success",
            data: {
                list_data: list_data,
                totalPage: totalold,
            },
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Internal Server Error",
        });
    }
};

export const getSerch = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { date,
            forceOnDuty,
            caseName,
            location,
            content,
            receive,
            custody,
            returns,
            handOver } = req.body

        const situationRepo = getRepository(SituationOfDay);
        const _data = await situationRepo
            .createQueryBuilder("situation_of_day")
            .select()
        if (date) {
            _data.where("situation_of_day.Date  =:date", { date: `%${formatDay(date)}%` })
        }
        if (forceOnDuty) {
            _data.where("situation_of_day.ForceOnDuty ILIKE :forceOnDuty", { forceOnDuty: `%${forceOnDuty}%` })
        }
        if (caseName) {
            _data.where("situation_of_day.CaseName ILIKE :caseName", { caseName: `%${caseName}%` })
        }
        if (location) {
            _data.where("situation_of_day.Location ILIKE :location", { location: `%${location}%` })
        }
        if (content) {
            _data.where("situation_of_day.Content ILIKE :content", { content: `%${content}%` })
        }

        if (receive) {
            _data.where("situation_of_day.Receive ILIKE :receive", { receive: `%${receive}%` })
        }

        if (custody) {
            _data.where("situation_of_day.Custody ILIKE :custody", { custody: `%${custody}%` })
        }

        if (returns) {
            _data.where("situation_of_day.Returns ILIKE :returns", { returns: `%${returns}%` })
        }

        if (handOver) {
            _data.where("situation_of_day.HandOver ILIKE :handOver", { handOver: `%${handOver}%` })
        }

        const _list = await _data.orderBy("situation_of_day.Id", "ASC")
            .getMany();

        if (_list) {
            const page = Number(req.query.page) || 1;
            const list_data = paginationHandle(page, _list);
            const total = totalPage(_list.length);

            return res.status(200).json({
                error_code: 0,
                msg: "success",
                data: {
                    list_data: list_data,
                    totalPage: total,
                },
            });
        } else {
            return res.status(404).json({
                error_code: 2,
                msg: "Situation of the day not found",
            });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Internal Server Error",
        });
    }
};

export const updateSituation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const situationRepo = getRepository(SituationOfDay);
        const id = Number(req.params.id);
        const role_id = (req as any).auth.payload.role;
        const { date,
            forceOnDuty,
            caseName,
            location,
            content,
            receive,
            custody,
            returns,
            handOver } = req.body
        const situation = await situationRepo.findOneBy({
            Id: id,
        });
        if (situation?.created_at === null) {
            return res.status(400).json({
                'error_code': 7,
                message: 'Editing error',
            });
        };

        if (checkDay(situation?.created_at) === true) {
            if (role_id === '1' || role_id === '6') {
                if (situation) {
                    situation.Date = formatDay(date)
                    situation.ForceOnDuty = forceOnDuty,
                        situation.CaseName = caseName,
                        situation.Location = location,
                        situation.Content = content,
                        situation.Receive = receive,
                        situation.Custody = custody,
                        situation.Returns = returns,
                        situation.HandOver = handOver

                    situationRepo.save(situation);
                    return res.status(200).json({
                        error_code: 0,
                        message: "Update successfully",
                        data:situation
                    });
                } else {
                    return res
                        .status(404)
                        .json({ message: "Situation of the day not found" });
                }
            } else {
                return res.status(400).json({
                    error_code: 1,
                    data: "Currently you do not have permission to edit",
                });
            }

        } else {
            if (role_id === '2' || role_id === '3' || role_id === '4' || role_id === '5') {
                if (situation) {
                    situation.Date = formatDay(date)
                    situation.ForceOnDuty = forceOnDuty,
                        situation.CaseName = caseName,
                        situation.Location = location,
                        situation.Content = content,
                        situation.Receive = receive,
                        situation.Custody = custody,
                        situation.Returns = returns,
                        situation.HandOver = handOver
                    situationRepo.save(situation);

                    return res.status(200).json({
                        error_code: 0,
                        message: "Update successfully",
                        data:situation
                    });
                } else {
                    return res
                        .status(404)
                        .json({ message: "Situation of the day not found" });
                }

            } else {
                return res.status(400).json({
                    error_code: 1,
                    data: "Currently you do not have permission to edit",
                });
            }
        }

    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
}

export const destroyHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id)
        const situationRepo = getRepository(SituationOfDay)
        const isCheck = await situationRepo
            .createQueryBuilder("situation_of_day")
            .select()
            .andWhere("situation_of_day.Id = :id", { id: id })
            .getOne()

        if (isCheck) {
            console.log("Delete loading")
            situationRepo.softDelete(id)

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
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};

export const moveToHandlingBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const situationRepo = getRepository(SituationOfDay);
        const situation = await situationRepo.findOneBy({
            Id: id
        })
        const date = new Date();
        const someDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
        const handlingRepository = getRepository(HandlingViolations)
        let handling = new HandlingViolations()
        handling.DateViolation = situation?.Date || someDate
        handling.NameOfViolation = situation?.CaseName || ''
        handling.AddressViolation = situation?.Location || ''
        handling.Content = situation?.Content || ''
        handling.FullNamePolice = situation?.Receive || ''
        handling.created_at = situation?.created_at

        await handlingRepository.save(handling)

        return res.status(200).json({
            'error_code': 0,
            'msg': 'Successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
}
export const exportToExcel = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { startDay, endDay } = req.query
        if (startDay && endDay) {
            const formatStartDay = formatDay(startDay)
            const formatEndDay = formatDay(endDay)
            const situationRepo = getRepository(SituationOfDay)
            const items = await situationRepo
                .createQueryBuilder("situation_of_day")
                .select()
                .where("situation_of_day.deletedAt is null")
                .andWhere("situation_of_day.created_at >= :formatStartDay ", { formatStartDay })
                .andWhere("situation_of_day.created_at <= :formatEndDay ", { formatEndDay })
                .orderBy("situation_of_day.Id", "DESC")
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
                { header: 'STT', key: 'Id', width: 10, color: 'blue' },
                { header: 'NGÀY THÁNG NĂM', key: 'Date', width: 10, color: 'blue' },
                { header: 'LỰC LƯỢNG TRỰC', key: 'ForceOnDuty', width: 30 },
                { header: 'TÊN VỤ VIỆC, TÌNH HÌNH', key: 'CaseName', width: 10 },
                { header: 'ĐỊA ĐIỂM XẢY RA', key: 'Location', width: 30 },
                { header: 'NỘI DUNG', key: 'Content', width: 30 },
                { header: 'CÁN BỘ NHẬN XỬ LÝ', key: 'PoliceHandle', width: 30 },
                { header: 'TẠM GIỮ', key: 'Custody', width: 15 },
                { header: 'TRAO TRẢ', key: 'Returns', width: 15 },
                { header: 'BÀN GIAO CA SAU', key: 'HandOver', width: 15 },

            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    Date: item.Date,
                    ForceOnDuty: item.ForceOnDuty,
                    CaseName: item.CaseName,
                    Location: item.Location,
                    Content: item.Content,
                    PoliceHandle: item.PoliceHandle,
                    Custody: item.Custody,
                    Returns: item.Returns,
                    HandOver: item.HandOver
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const situationRepo = getRepository(SituationOfDay)
            const items = await situationRepo
                .createQueryBuilder("situation_of_day")
                .select()
                .where("situation_of_day.deletedAt is null")
                .orderBy("situation_of_day.Id", "DESC")
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
                { header: 'STT', key: 'Id', width: 10, color: 'blue' },
                { header: 'NGÀY THÁNG NĂM', key: 'Date', width: 10, color: 'blue' },
                { header: 'LỰC LƯỢNG TRỰC', key: 'ForceOnDuty', width: 30 },
                { header: 'TÊN VỤ VIỆC, TÌNH HÌNH', key: 'CaseName', width: 10 },
                { header: 'ĐỊA ĐIỂM XẢY RA', key: 'Location', width: 30 },
                { header: 'NỘI DUNG', key: 'Content', width: 30 },
                { header: 'CÁN BỘ NHẬN XỬ LÝ', key: 'PoliceHandle', width: 30 },
                { header: 'TẠM GIỮ', key: 'Custody', width: 15 },
                { header: 'TRAO TRẢ', key: 'Returns', width: 15 },
                { header: 'BÀN GIAO CA SAU', key: 'HandOver', width: 15 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    Date: item.Date,
                    ForceOnDuty: item.ForceOnDuty,
                    CaseName: item.CaseName,
                    Location: item.Location,
                    Content: item.Content,
                    PoliceHandle: item.PoliceHandle,
                    Custody: item.Custody,
                    Returns: item.Returns,
                    HandOver: item.HandOver
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
