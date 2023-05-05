import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { CalendarProtectsEvents } from "../../entity/CalendarProtectsEvents";
import { checkDay, formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const moment = require("moment");
const Excel = require('exceljs');

export const createHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date, location, force, mission, note } = req.body
        const calendarRepo = getRepository(CalendarProtectsEvents)
        const calendar = new CalendarProtectsEvents()
        const date_create = new Date();
        const someDate = moment(date_create).format("YYYY-MM-DD HH:mm:ss");
        calendar.Date = date
        calendar.Location = location
        calendar.Force = force
        calendar.Mission = mission
        calendar.Note = note
        calendar.created_at = someDate
        calendarRepo.save(calendar)

        return res.status(200).json({
            'error_code': 0,
            'msg': 'success',
            data: calendar
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
}

export const getCalendar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const calendarRepo = getRepository(CalendarProtectsEvents);
        const _list = await calendarRepo
            .createQueryBuilder("calendar_protects_events")
            .select()
            .orderBy("calendar_protects_events.Id", "DESC")
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
        const { date, location, force, mission, note } = req.body
        const calendarRepo = getRepository(CalendarProtectsEvents);
        const _data = await calendarRepo
            .createQueryBuilder("calendar_protects_events")
            .select()
        if (date) {
            _data.where("calendar_protects_events.Date ILIKE :date", { date: `%${date}%` })
        }
        if (location) {
            _data.where("calendar_protects_events.Location ILIKE :location", { location: `%${location}%` })
        }
        if (force) {
            _data.where("calendar_protects_events.Force ILIKE :force", { force: `%${force}%` })
        }
        if (mission) {
            _data.where("calendar_protects_events.Mission ILIKE :mission", { mission: `%${mission}%` })
        }
        if (note) {
            _data.where("calendar_protects_events.Note ILIKE :note", { note: `%${note}%` })
        }
        const _list = await _data.orderBy("calendar_protects_events.Id", "ASC")
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
}

export const updateHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const calendarRepo = getRepository(CalendarProtectsEvents);
        const id = Number(req.params.id);
    
        const role_id = (req as any).auth.payload.role;
        const { date, location, force, mission, note } = req.body
        const calendar = await calendarRepo.findOneBy({
            Id: id,
        });

        if (calendar?.created_at === null) {
            return res.status(400).json({
                'error_code': 7,
                message: 'Editing error',
            });
        };
        if (checkDay(calendar?.created_at) == true) {
            if (role_id === "1" || role_id === "6") {
                if (calendar) {
                    calendar.Date = date
                    calendar.Location = location
                    calendar.Force = force
                    calendar.Mission = mission
                    calendar.Note = note

                    calendarRepo.save(calendar);
                    
                    return res.status(200).json({
                        error_code: 0,
                        message: "Update successfully",
                        data:calendar
                    });
                } else {
                    return res
                        .status(404)
                        .json({ message: "Situation of the day not found" });
                }
            } else {
                return res.status(400).json({
                    error_code: 1,
                    message: "Currently you do not have permission to edit",
                });
            }

        } else {
                if (role_id === '2' || role_id === '3' || role_id === '4' || role_id === '5' || role_id==='6') {
                    if (calendar) {
                        calendar.Date = date
                        calendar.Location = location
                        calendar.Force = force
                        calendar.Mission = mission
                        calendar.Note = note
                        calendarRepo.save(calendar);

                        return res.status(200).json({
                            error_code: 0,
                            message: "Update successfully",
                            data:calendar
                        });
                    } else {
                        return res
                            .status(404)
                            .json({ message: "Situation of the day not found" });
                    }

                } else {
                    return res.status(400).json({
                        error_code: 1,
                        message: "Currently you do not have permission to edit",
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
        const calendarRepo = getRepository(CalendarProtectsEvents)
        const isCheck = await calendarRepo.findOneBy({
            Id: id
        })

        if (isCheck) {
            console.log("Delete loading")
            calendarRepo.softDelete(id)

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
            const calendarRepo = getRepository(CalendarProtectsEvents)
            const items = await calendarRepo
                .createQueryBuilder("calendar_protects_events")
                .select()
                .where("calendar_protects_events.deletedAt is null")
                .andWhere("calendar_protects_events.created_at >= :formatStartDay ", { formatStartDay })
                .andWhere("calendar_protects_events.created_at <= :formatEndDay ", { formatEndDay })
                .orderBy("calendar_protects_events.Id", "DESC")
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
                { header: 'STT', key: 'Id', width: 30 },
                { header: 'NGÀY THÁNG', key: 'Date', width: 10, color: 'blue' },
                { header: 'ĐỊA ĐIỂM', key: 'Location', width: 30 },
                { header: 'LỰC LƯỢNG', key: 'Force', width: 10 },
                { header: 'NHIỆM VỤ', key: 'Mission', width: 30 },
                { header: 'GHI CHÚ', key: 'Note', width: 30 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id:startNumber,
                    Date: item.Date,
                    Location: item.Location,
                    Force: item.Force,
                    Mission: item.Mission,
                    Note: item.Note
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const calendarRepo = getRepository(CalendarProtectsEvents)
            const items = await calendarRepo
                .createQueryBuilder("calendar_protects_events")
                .select()
                .where("calendar_protects_events.deletedAt is null")
                .orderBy("calendar_protects_events.Id", "DESC")
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
                { header: 'STT', key: 'Id', width: 30 },
                { header: 'NGÀY THÁNG', key: 'Date', width: 10, color: 'blue' },
                { header: 'ĐỊA ĐIỂM', key: 'Location', width: 30 },
                { header: 'LỰC LƯỢNG', key: 'Force', width: 10 },
                { header: 'NHIỆM VỤ', key: 'Mission', width: 30 },
                { header: 'GHI CHÚ', key: 'Note', width: 30 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id:startNumber,
                    Date: item.Date,
                    Location: item.Location,
                    Force: item.Force,
                    Mission: item.Mission,
                    Note: item.Note
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