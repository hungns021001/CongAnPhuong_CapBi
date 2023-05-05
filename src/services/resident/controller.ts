import { NextFunction, Request, Response } from "express";
import { Resident } from "../../entity/Resident";
import { getRepository } from "typeorm";
import { checkDay, formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const moment = require('moment');
const Excel = require('exceljs');

export const createResidentHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { date,
            address,
            host,
            fullName,
            citizenNumber,
            violationer,
            formProcessing,
            policeCheck } = req.body;
        const translatedate = new Date();
        const someDate = moment(translatedate).format("YYYY-MM-DD HH:mm:ss");
        const residentRepository = getRepository(Resident)
        let resident = new Resident()
        resident.Date = formatDay(date),
            resident.Address = address,
            resident.Host = host,
            resident.FullName = fullName,
            resident.CitizenNumber = citizenNumber,
            resident.Violationer = violationer,
            resident.FormProcessing = formProcessing,
            resident.PoliceCheck = policeCheck,
            resident.createdAt = someDate
        residentRepository.save(resident);

        return res.status(200).json({
            'error_code': 0,
            'msg': 'Created successfully',
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};

export const getResident = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const residentRepository = getRepository(Resident)
        const _list = await residentRepository
            .createQueryBuilder("resident")
            .select()
            .orderBy("resident.Id", "DESC")
            .getMany()

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
        console.error("get-resident: ", err);
        res.status(500).send({
            msg: "Get internal server error in get resident",
        });
    }
};

export const getResidentByName = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { date,
            address,
            host,
            fullName,
            citizenNumber,
            violationer,
            formProcessing,
            policeCheck } = req.body;
        const residentRepository = getRepository(Resident)
        const search = await residentRepository
            .createQueryBuilder("resident")
            .select()

        if (date)
            search.where("resident.Date =:date", { date: `${formatDay(date)}` })
        if (address)
            search.where("resident.Address ILIKE :address", { address: `%${address}%` })
        if (host)
            search.where("resident.Host ILIKE :host", { host: `%${(host)}%` })
        if (fullName)
            search.where("resident.FullName ILIKE :fullName", { fullName: `%${fullName}%` })
        if (citizenNumber)
            search.where("resident.CitizenNumber =:citizenNumber", { citizenNumber: `${citizenNumber}` })
        if (violationer)
            search.where("resident.Violationer ILIKE :violationer", { violationer: `%${violationer}%` })
        if (formProcessing)
            search.where("resident.FormProcessing ILIKE :formProcessing", { formProcessing: `%${formProcessing}%` })
        if (policeCheck)
            search.where("resident.PoliceCheck ILIKE :policeCheck", { policeCheck: `%${policeCheck}%` })

        const _data = await search
            .orderBy("resident.Id", "ASC")
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
                'msg': 'resident not found',
            })
        }
    } catch (err: any) {
        console.error("create-shift: ", err);
        res.status(500).send({
            msg: "Get internal server error in search resident",
        });
    }
};

export const updateResidentHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const residentRepository = getRepository(Resident)
        const role_id = (req as any).auth.payload.role;
        const id = Number(req.params.id)
        const { date,
            address,
            host,
            fullName,
            citizenNumber,
            violationer,
            formProcessing,
            policeCheck } = req.body;
        const resident = await residentRepository
            .createQueryBuilder("resident")
            .select()
            .where("resident.Id = :id", { id: id })
            .getOne()

        if (resident) {
            resident.Date = formatDay(date),
                resident.Address = address,
                resident.Host = host,
                resident.FullName = fullName,
                resident.CitizenNumber = citizenNumber,
                resident.Violationer = violationer,
                resident.FormProcessing = formProcessing,
                resident.PoliceCheck = policeCheck,
                residentRepository.save(resident)

            return res.status(200).json({
                'error_code': 0,
                message: 'Update successfully',
                data: resident
            });
        } else {
            return res.status(404).json({ message: "resident not found" });
        }

    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};

export const destroyHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id)
        const role_id = (req as any).auth.payload.role;
        const residentRepository = getRepository(Resident)
        const isCheck = await residentRepository
            .createQueryBuilder("resident")
            .select()
            .where("resident.Id = :id", { id: id })
            .getOne()

        if (isCheck) {
            console.log("Delete loading")
            residentRepository.softDelete(id)

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
export const exportToExcel = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { startDay, endDay } = req.query
        if (startDay && endDay) {
            const formatStartDay = formatDay(startDay)
            const formatEndDay = formatDay(endDay)
            const residentRepository = getRepository(Resident)
            const items = await residentRepository
                .createQueryBuilder("resident")
                .select()
                .where("resident.deletedAt is null")
                .andWhere("resident.createdAt >= :formatStartDay ", { formatStartDay })
                .andWhere("resident.createdAt <= :formatEndDay ", { formatEndDay })
                .orderBy("resident.Id", "DESC")
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
                { header: 'NGÀY KIỂM TRA', key: 'Date', width: 10, color: 'blue' },
                { header: 'ĐỊA CHỈ KIỂM TRA', key: 'Address', width: 30 },
                { header: 'CHỦ NHÀ TRỌ/CHỦ HỘ', key: 'Host', width: 10 },
                { header: 'HỌ TÊN NGƯỜI ĐƯỢC KIỂM TRA', key: 'FullName', width: 30 },
                { header: 'SỐ CCCD', key: 'CitizenNumber', width: 30 },
                { header: 'NGƯỜI VI PHẠM', key: 'Violationer', width: 30 },
                { header: 'HÌNH THỨC XỬ LÝ', key: 'FormProcessing', width: 30 },
                { header: 'CSKV KIỂM TRA', key: 'PoliceCheck', width: 30 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    Date: item.Date,
                    Address: item.Address,
                    Host: item.Host,
                    FullName: item.FullName,
                    CitizenNumber: item.CitizenNumber,
                    Violationer: item.Violationer,
                    FormProcessing: item.FormProcessing,
                    PoliceCheck: item.PoliceCheck
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const residentRepository = getRepository(Resident)
            const items = await residentRepository
                .createQueryBuilder("resident")
                .select()
                .where("resident.deletedAt is null")
                .orderBy("resident.Id", "DESC")
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
                { header: 'NGÀY KIỂM TRA', key: 'Date', width: 10, color: 'blue' },
                { header: 'ĐỊA CHỈ KIỂM TRA', key: 'Address', width: 30 },
                { header: 'CHỦ NHÀ TRỌ/CHỦ HỘ', key: 'Host', width: 10 },
                { header: 'HỌ TÊN NGƯỜI ĐƯỢC KIỂM TRA', key: 'FullName', width: 30 },
                { header: 'SỐ CCCD', key: 'CitizenNumber', width: 30 },
                { header: 'NGƯỜI VI PHẠM', key: 'Violationer', width: 30 },
                { header: 'HÌNH THỨC XỬ LÝ', key: 'FormProcessing', width: 30 },
                { header: 'CSKV KIỂM TRA', key: 'PoliceCheck', width: 30 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    Date: item.Date,
                    Address: item.Address,
                    Host: item.Host,
                    FullName: item.FullName,
                    CitizenNumber: item.CitizenNumber,
                    Violationer: item.Violationer,
                    FormProcessing: item.FormProcessing,
                    PoliceCheck: item.PoliceCheck
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

