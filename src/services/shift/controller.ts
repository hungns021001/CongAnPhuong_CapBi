import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { DutyBook } from "../../entity/DutyBook";
import { formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const Excel = require('exceljs');

export const createShiftHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { date,
            hourOnDuty,
            fullName,
            total,
            present,
            excusedAbsence,
            absenceNoReason,
            contentOfShift,
            informationOfShift,
            directiveInformation,
            fullnameHandover,
            fullnameReceiver,
            leadShift } = req.body;

        const shiftRepository = getRepository(DutyBook)
        let shift = new DutyBook()
        shift.Date = formatDay(date)
        shift.HourOnDuty = hourOnDuty
        shift.Total = total
        shift.FullName = fullName
        shift.Present = present
        shift.ExcusedAbsence = excusedAbsence
        shift.AbsenceNoReason = absenceNoReason
        shift.ContentOfShift = contentOfShift
        shift.InformationOfShift = informationOfShift
        shift.DirectiveInformation = directiveInformation
        shift.FullNameHandover = fullnameHandover
        shift.FullNameReceiver = fullnameReceiver
        shift.LeadShift = leadShift

        shiftRepository.save(shift);

        return res.json({
            'error_code': 0,
            'msg': 'success',
            data: shift
        });
    } catch (err: any) {
        console.error("create-shift: ", err);
        res.status(500).send({
            msg: "Get internal server error in create shift handler",
        });
    }
};

export const getShift = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { date } = req.body;
        const dutyBookRepository = getRepository(DutyBook)
        let _list: any[];
        if(!date){
            _list = await dutyBookRepository
            .createQueryBuilder("duty_book")
            .select()
            .where("duty_book.deletedAt is null")
            .orderBy("duty_book.Id","DESC")
            .getMany()
        }else{
            _list = await dutyBookRepository
            .createQueryBuilder("duty_book")
            .select()
            .where("duty_book.Date =:date", { date: `${formatDay(date)}` })
            .andWhere("duty_book.deletedAt is null")
            .orderBy("duty_book.Id", "DESC")
            .getMany()

        }     
        const page = Number(req.query.page) || 1
        const list_data = paginationHandle(page, _list)
        if (_list.length === 0) {
            return res.status(200).json({
                'error_code': 4,
                'msg': 'Data Not Found',
                data: {
                    'list_data': []
                }
            });
        }

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
        console.error("create-shift: ", err);
        res.status(500).send({
            msg: "Get internal server error in create shift handler",
        });
    }
};

export const getShiftByName = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { date,
            hourOnDuty,
            fullName,
            total,
            present,
            excusedAbsence,
            absenceNoReason,
            contentOfShift,
            informationOfShift,
            directiveInformation,
            fullnameHandover,
            fullnameReceiver,
            leadShift } = req.body;
        const dutyBookRepository = getRepository(DutyBook)
        const search = await dutyBookRepository
            .createQueryBuilder('duty_book')
            .select()
        if (hourOnDuty)
            search.where("duty_book.HourOnDuty =:hourOnDuty", { hourOnDuty: `${hourOnDuty}` })
        if (fullName)
            search.where("duty_book.FullName ILIKE :fullName", { fullName: `%${fullName}%` })
        if (total)
            search.where("duty_book.Total =:total", { total: `${total}` })
        if (present)
            search.where("duty_book.Present =:present", { present: `${present}` })
        if (excusedAbsence)
            search.where("duty_book.ExcusedAbsence =:excusedAbsence", { excusedAbsence: `${excusedAbsence}` })
        if (absenceNoReason)
            search.where("duty_book.AbsenceNoReason =:absenceNoReason", { absenceNoReason: `${absenceNoReason}` })
        if (contentOfShift)
            search.where("duty_book.ContentOfShift ILIKE :contentOfShift", { contentOfShift: `%${contentOfShift}%` })
        if (informationOfShift)
            search.where("duty_book.InformationOfShift ILIKE :informationOfShift", { informationOfShift: `%${informationOfShift}%` })
        if (directiveInformation)
            search.where("duty_book.DirectiveInformation ILIKE :directiveInformation", { directiveInformation: `%${directiveInformation}%` })
        if (fullnameHandover)
            search.where("duty_book.FullNameHandover ILIKE :fullnameHandover", { fullnameHandover: `%${fullnameHandover}%` })
        if (fullnameReceiver)
            search.where("duty_book.FullNameReceiver ILIKE :fullnameReceiver", { fullnameReceiver: `%${fullnameReceiver}%` })
        if (leadShift)
            search.where("duty_book.LeadShift ILIKE :leadShift", { leadShift: `%${leadShift}%` })
        const _data = await search.orderBy("duty_book.Id", "ASC")
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
                'msg': 'Shift not found',
            })
        }



    } catch (err: any) {
        console.error("create-shift: ", err);
        res.status(500).send({
            msg: "Get internal server error in create shift handler",
        });
    }
};

export const updateShiftHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const dutyBookRepository = getRepository(DutyBook)
        const shiftId = Number(req.params.id)
        const { date,
            hourOnDuty,
            fullName,
            total,
            present,
            excusedAbsence,
            absenceNoReason,
            contentOfShift,
            informationOfShift,
            directiveInformation,
            fullnameHandover,
            fullnameReceiver,
            leadShift } = req.body;

        const shift = await dutyBookRepository.findOneBy({ Id: shiftId })

        if (shift) {
            shift.Date = formatDay(date)
            shift.HourOnDuty = hourOnDuty
            shift.Total = total
            shift.FullName = fullName
            shift.Present = present
            shift.ExcusedAbsence = excusedAbsence
            shift.AbsenceNoReason = absenceNoReason
            shift.ContentOfShift = contentOfShift
            shift.InformationOfShift = informationOfShift
            shift.DirectiveInformation = directiveInformation
            shift.FullNameHandover = fullnameHandover
            shift.FullNameReceiver = fullnameReceiver
            shift.LeadShift = leadShift

            dutyBookRepository.save(shift)

            return res.status(200).json({
                'error_code': 0,
                message: 'Update successfully',
                data: shift
            });
        } else {
            return res.status(404).json({ message: "Shift not found" });
        }

    } catch (err: any) {
        console.error("create-shift: ", err);
        res.status(500).send({
            msg: "Get internal server error in create shift handler",
        });
    }
};

export const destroyHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id)
        const shiftRepository = getRepository(DutyBook)
        const isCheck = await shiftRepository.findOneBy({ Id: id })

        if (isCheck) {
            console.log("Delete loading")
            shiftRepository.softDelete(id)

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
        console.error("delete-shift: ", err);
        res.status(500).send({
            msg: "Get internal server error in create shift handler",
        });
    }
};
export const exportToExcel = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { startDay, endDay } = req.query
        if (startDay && endDay) {
            const formatStartDay = formatDay(startDay)
            const formatEndDay = formatDay(endDay)
            const shiftRepository = getRepository(DutyBook)
            const items = await shiftRepository
                .createQueryBuilder("duty_book")
                .select()
                .where("duty_book.deletedAt is null")
                .andWhere("duty_book.createdAt >= :formatStartDay ", { formatStartDay })
                .andWhere("duty_book.createdAt <= :formatEndDay ", { formatEndDay })
                .orderBy("duty_book.Id", "DESC")
                .getMany()
            if (items.length === 0) {
                return res.status(400).json({
                    error_code: "6",
                    message: "There is no data to export."
                })
            }else{
                const workbook = new Excel.Workbook();
                const worksheet = workbook.addWorksheet('Items');
    
                worksheet.columns = [
                    { header: 'STT', key: 'Id', width: 10, color: 'blue' },
                    { header: 'NGÀY', key: 'Date', width: 10, color: 'blue' },
                    { header: 'GIỜ TRỰC', key: 'HourOnDuty', width: 10, color: 'blue' },
                    { header: 'TRỰC LÃNH ĐẠO, CHỈ HUY', key: 'FullName', width: 30 },
                    { header: 'TỔNG QUÂN SỐ', key: 'Total', width: 10 },
                    { header: 'QUÂN SỐ CÓ MẶT', key: 'Present', width: 30 },
                    { header: 'VẮNG CÓ LÝ DO', key: 'ExcusedAbsence', width: 30 },
                    { header: 'VẮNG KHÔNG LÝ DO', key: 'AbsenceNoReason', width: 30 },
                    { header: 'NỘI DUNG CA TRỰC', key: 'ContentOfShift', width: 15 },
                    { header: 'XỬ LÝ THÔNG TIN, TÀI LIỆU,...', key: 'InformationOfShift', width: 15 },
                    { header: 'CHỈ ĐẠO XỬ LÝ THÔNG TIN', key: 'DirectiveInformation', width: 15 },
                    { header: 'CÁN BỘ BÀN GIAO', key: 'FullNameHandover', width: 15 },
                    { header: 'CÁN BỘ NHẬN', key: 'FullNameReceiver', width: 15 },
                    { header: 'CHỈ HUY CA TRỰC', key: 'LeadShift', width: 15 }
                ];
                let startNumber = 1;
                items.forEach(item => {
                    worksheet.addRow({
                        Id:startNumber,
                        Date: item.Date,
                        HourOnDuty: item.HourOnDuty,
                        FullName: item.FullName,
                        Total: item.Total,
                        Present: item.Present,
                        ExcusedAbsence: item.ExcusedAbsence,
                        AbsenceNoReason: item.AbsenceNoReason,
                        ContentOfShift: item.ContentOfShift,
                        InformationOfShift: item.InformationOfShift,
                        DirectiveInformation: item.DirectiveInformation,
                        FullNameHandover: item.FullNameHandover,
                        FullNameReceiver: item.FullNameReceiver,
                        LeadShift: item.LeadShift
                    });
                    startNumber++
                });
                res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
                // Lưu workbook xuống tệp Excel
                await workbook.xlsx.write(res)
            }
        } else {
            const shiftRepository = getRepository(DutyBook)
            const items = await shiftRepository
                .createQueryBuilder("duty_book")
                .select()
                .where('duty_book."deletedAt" is null')
                .orderBy("duty_book.Id", "DESC")
                .getMany()
            if (items.length === 0) {
                return res.status(400).json({
                    error_code: "6",
                    message: "There is no data to export."
                })
            }else{
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet('Items');

            worksheet.columns = [
                { header: 'STT', key: 'Id', width: 10, color: 'blue' },
                { header: 'NGÀY', key: 'Date', width: 10, color: 'blue' },
                { header: 'GIỜ TRỰC', key: 'HourOnDuty', width: 10, color: 'blue' },
                { header: 'TRỰC LÃNH ĐẠO, CHỈ HUY', key: 'FullName', width: 30 },
                { header: 'TỔNG QUÂN SỐ', key: 'Total', width: 10 },
                { header: 'QUÂN SỐ CÓ MẶT', key: 'Present', width: 30 },
                { header: 'VẮNG CÓ LÝ DO', key: 'ExcusedAbsence', width: 30 },
                { header: 'VẮNG KHÔNG LÝ DO', key: 'AbsenceNoReason', width: 30 },
                { header: 'NỘI DUNG CA TRỰC', key: 'ContentOfShift', width: 15 },
                { header: 'XỬ LÝ THÔNG TIN, TÀI LIỆU,...', key: 'InformationOfShift', width: 15 },
                { header: 'CHỈ ĐẠO XỬ LÝ THÔNG TIN', key: 'DirectiveInformation', width: 15 },
                { header: 'CÁN BỘ BÀN GIAO', key: 'FullNameHandover', width: 15 },
                { header: 'CÁN BỘ NHẬN', key: 'FullNameReceiver', width: 15 },
                { header: 'CHỈ HUY CA TRỰC', key: 'LeadShift', width: 15 }
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id:startNumber,
                    Date: item.Date,
                    HourOnDuty: item.HourOnDuty,
                    FullName: item.FullName,
                    Total: item.Total,
                    Present: item.Present,
                    ExcusedAbsence: item.ExcusedAbsence,
                    AbsenceNoReason: item.AbsenceNoReason,
                    ContentOfShift: item.ContentOfShift,
                    InformationOfShift: item.InformationOfShift,
                    DirectiveInformation: item.DirectiveInformation,
                    FullNameHandover: item.FullNameHandover,
                    FullNameReceiver: item.FullNameReceiver,
                    LeadShift: item.LeadShift
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
            }   
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }

};
