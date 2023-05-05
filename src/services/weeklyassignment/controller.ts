import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { WeeklyAssignment } from "../../entity/WeeklyAssignment";
import { checkDay, formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const moment = require('moment');
const Excel = require('exceljs');
export const createHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { days, date, captain, inHour, overTime, onDuty, patrolShiftOne, patrolShiftTwo } = req.body
        const weeklyAssignmentRepo = getRepository(WeeklyAssignment)
        const date_create = new Date();
        const someDate = moment(date_create).format("YYYY-MM-DD HH:mm:ss");
        const weeklyAssignment = new WeeklyAssignment()
        weeklyAssignment.Days = days
        weeklyAssignment.Date = formatDay(date)
        weeklyAssignment.Captain = captain
        weeklyAssignment.InHour = inHour
        weeklyAssignment.OverTime = overTime
        weeklyAssignment.OnDuty = onDuty
        weeklyAssignment.PatrolShiftOne = patrolShiftOne
        weeklyAssignment.PatrolShiftTwo = patrolShiftTwo
        weeklyAssignment.created_at = someDate

        await weeklyAssignmentRepo.save(weeklyAssignment)

        return res.status(200).json({
            'error_code': 0,
            'msg': 'success',
            data: weeklyAssignment
        });

    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
}

export const getAllData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const weeklyAssignmentRepo = getRepository(WeeklyAssignment);
        const _list = await weeklyAssignmentRepo
            .createQueryBuilder("weekly_assignment")
            .select()
            .orderBy("weekly_assignment.Id", "DESC")
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
}

export const getSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { days, date, captain, inHour, overTime, onDuty, patrolShiftOne, patrolShiftTwo } = req.body
        const weeklyAssignmentRepo = getRepository(WeeklyAssignment);
        const _data = await weeklyAssignmentRepo
            .createQueryBuilder("weekly_assignment")
            .select()
        if (days) {
            _data.where("weekly_assignment.Days ILIKE :days", { days: `%${days}%` })
        }
        if (date) {
            _data.where("weekly_assignment.Date = :date", { date: `%${formatDay(date)}%` })
        }
        if (captain) {
            _data.where("weekly_assignment.Captain ILIKE :captain", { captain: `%${captain}%` })
        }
        if (inHour) {
            _data.where("weekly_assignment.InHour ILIKE :inHour", { inHour: `%${inHour}%` })
        }
        if (overTime) {
            _data.where("weekly_assignment.OverTime ILIKE :overTime", { overTime: `%${overTime}%` })
        }
        if (onDuty) {
            _data.where("weekly_assignment.OnDuty ILIKE :onDuty", { onDuty: `%${onDuty}%` })
        }
        if (patrolShiftOne) {
            _data.where("weekly_assignment.PatrolShiftOne ILIKE :patrolShiftOne", { patrolShiftOne: `%${patrolShiftOne}%` })
        }
        if (patrolShiftTwo) {
            _data.where("weekly_assignment.PatrolShiftTwo ILIKE :patrolShiftTwo", { patrolShiftTwo: `%${patrolShiftTwo}%` })
        }
        const _list = await _data.orderBy("weekly_assignment.Id", "ASC")
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
                msg: "Weekly Assignment not found",
            });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Internal Server Error",
        });
    }
}

export const updateHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const weeklyAssignmentRepo = getRepository(WeeklyAssignment);
        const id = Number(req.params.id);
        const role_id = (req as any).auth.payload.role;
        const { days, date, captain, inHour, overTime, onDuty, patrolShiftOne, patrolShiftTwo } = req.body
        const weeklyAssignment = await weeklyAssignmentRepo.findOneBy({
            Id: id,
        });
        if (weeklyAssignment?.created_at === null) {
            return res.status(400).json({
                'error_code': 7,
                message: 'Editing error',
            });
        };        
        if (checkDay(weeklyAssignment?.created_at) == true) {
            if (role_id === '1' || role_id === '6') {                
                if (weeklyAssignment) {                    
                    weeklyAssignment.Days = days
                    weeklyAssignment.Date = formatDay(date)
                    weeklyAssignment.Captain = captain
                    weeklyAssignment.InHour = inHour
                    weeklyAssignment.OverTime = overTime
                    weeklyAssignment.OnDuty = onDuty
                    weeklyAssignment.PatrolShiftOne = patrolShiftOne
                    weeklyAssignment.PatrolShiftTwo = patrolShiftTwo
                    weeklyAssignmentRepo.save(weeklyAssignment);

                    return res.status(200).json({
                        error_code: 0,
                        data: "Update successfully",
                    });
                } else {
                    return res
                        .status(404)
                        .json({ message: "Weekly Assignment not found" });
                }
            } else {                    
                return res.status(400).json({
                    error_code: 1,
                    data: "Currently you do not have permission to edit",
                });
            }

        } else {
            if (role_id === '2' || role_id === '3' || role_id === '4' || role_id === '5'|| role_id === '6') {                
                if (weeklyAssignment) {
                    weeklyAssignment.Days = days
                    weeklyAssignment.Date = formatDay(date)
                    weeklyAssignment.Captain = captain
                    weeklyAssignment.InHour = inHour
                    weeklyAssignment.OverTime = overTime
                    weeklyAssignment.OnDuty = onDuty
                    weeklyAssignment.PatrolShiftOne = patrolShiftOne
                    weeklyAssignment.PatrolShiftTwo = patrolShiftTwo
                    weeklyAssignmentRepo.save(weeklyAssignment);

                    return res.status(200).json({
                        error_code: 0,
                        data: "Update successfully",
                    });
                } else {
                    return res
                        .status(404)
                        .json({ message: "Weekly Assignment not found" });
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

export const destroyHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const weeklyAssignmentRepo = getRepository(WeeklyAssignment)
        const isCheck = await weeklyAssignmentRepo.findOneBy({
            Id: id
        })

        if (isCheck) {
            console.log("Delete loading")
            weeklyAssignmentRepo.softDelete(id)

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
}
export const exportToExcel = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { startDay, endDay } = req.query
        if (startDay && endDay) {
            const formatStartDay = formatDay(startDay)
            const formatEndDay = formatDay(endDay)
            const weeklyAssignmentRepo = getRepository(WeeklyAssignment)
            const items = await weeklyAssignmentRepo
                .createQueryBuilder("weekly_assignment")
                .select()
                .where("weekly_assignment.deletedAt is null")
                .andWhere("weekly_assignment.created_at >= :formatStartDay ", { formatStartDay })
                .andWhere("weekly_assignment.created_at <= :formatEndDay ", { formatEndDay })
                .orderBy("weekly_assignment.Id", "DESC")
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
                { header: 'THỨ', key: 'Days', width: 10, color: 'blue' },
                { header: 'NGÀY THÁNG NĂM', key: 'Date', width: 10, color: 'blue' },
                { header: 'TRỰC CHỈ HUY', key: 'Captain', width: 30 },
                { header: 'TRỰC BAN TRONG GIỜ', key: 'InHour', width: 10 },
                { header: 'TRỰC BAN NGOÀI GIỜ', key: 'OverTime', width: 30 },
                { header: 'TRỰC CHIẾN', key: 'OnDuty', width: 30 },
                { header: 'TUẦN TRA CA 1', key: 'PatrolShiftOne', width: 30 },
                { header: 'TUẦN TRA CA 2', key: 'PatrolShiftTwo', width: 15 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id:startNumber,
                    Days: item.Days,
                    Date: item.Date,
                    Captain: item.Captain,
                    InHour: item.InHour,
                    OverTime: item.OverTime,
                    OnDuty: item.OnDuty,
                    PatrolShiftOne: item.PatrolShiftOne,
                    PatrolShiftTwo: item.PatrolShiftTwo
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const weeklyAssignmentRepo = getRepository(WeeklyAssignment)
            const items = await weeklyAssignmentRepo
                .createQueryBuilder("weekly_assignment")
                .select()
                .where("weekly_assignment.deletedAt is null")
                .orderBy("weekly_assignment.Id", "DESC")
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
                { header: 'THỨ', key: 'Days', width: 10, color: 'blue' },
                { header: 'NGÀY THÁNG NĂM', key: 'Date', width: 10, color: 'blue' },
                { header: 'TRỰC CHỈ HUY', key: 'Captain', width: 30 },
                { header: 'TRỰC BAN TRONG GIỜ', key: 'InHour', width: 10 },
                { header: 'TRỰC BAN NGOÀI GIỜ', key: 'OverTime', width: 30 },
                { header: 'TRỰC CHIẾN', key: 'OnDuty', width: 30 },
                { header: 'TUẦN TRA CA 1', key: 'PatrolShiftOne', width: 30 },
                { header: 'TUẦN TRA CA 2', key: 'PatrolShiftTwo', width: 15 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id:startNumber,
                    Days: item.Days,
                    Date: item.Date,
                    Captain: item.Captain,
                    InHour: item.InHour,
                    OverTime: item.OverTime,
                    OnDuty: item.OnDuty,
                    PatrolShiftOne: item.PatrolShiftOne,
                    PatrolShiftTwo: item.PatrolShiftTwo
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