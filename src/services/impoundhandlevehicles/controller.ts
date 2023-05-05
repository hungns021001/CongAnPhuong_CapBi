import e, {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {ImpoundHandleVehicles} from "../../entity/ImpoundHandleVehicles";
import {checkDay, formatDay, paginationHandle, totalPage} from "../../libs/common/pagination";
import {log} from "console";

const moment = require("moment");
const Excel = require('exceljs');


export const createHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role_id = (req as any).auth.payload.role;

        if (role_id === "6" || role_id === "1") {
            const {
                returnDate,
                licensePlates,
                dateOfViolation,
                fullname,
                onHold,
                returned,
                officerReturns
            } = req.body;
            const date_create = new Date();
            const someDate = moment(date_create).format("YYYY-MM-DD HH:mm:ss");
            const impoundRepository = getRepository(ImpoundHandleVehicles)
            const impoundHandle = new ImpoundHandleVehicles()
            impoundHandle.ReturnDate = formatDay(returnDate)
            impoundHandle.LicensePlates = licensePlates
            impoundHandle.DateOfViolation = formatDay(dateOfViolation)
            impoundHandle.FullName = fullname
            impoundHandle.OnHold = onHold
            impoundHandle.Returned = returned
            impoundHandle.OfficerReturns = officerReturns
            impoundHandle.created_at = someDate
            impoundHandle.RoleId = Number(role_id)
            impoundRepository.save(impoundHandle)

            return res.status(200).json({
                'error_code': 0,
                'msg': 'success',
                data: impoundHandle
            });
        } else {
            const {returnDate, licensePlates, dateOfViolation, fullname, onHold, returned, officerReturns} = req.body;
            const date_create = new Date();
            const someDate = moment(date_create).format("YYYY-MM-DD HH:mm:ss");
            const impoundRepository = getRepository(ImpoundHandleVehicles)
            const impoundHandle = new ImpoundHandleVehicles()
            impoundHandle.ReturnDate = formatDay(returnDate)
            impoundHandle.LicensePlates = licensePlates
            impoundHandle.DateOfViolation = formatDay(dateOfViolation)
            impoundHandle.FullName = fullname
            impoundHandle.OnHold = onHold
            impoundHandle.Returned = returned
            impoundHandle.OfficerReturns = officerReturns
            impoundHandle.created_at = someDate
            impoundHandle.RoleId = Number(role_id)
            impoundRepository.save(impoundHandle)

            return res.status(200).json({
                'error_code': 0,
                'msg': 'success',
                data: impoundHandle
            });
        }

    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
}

export const getImpoundHandleVehicles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role_id = (req as any).auth.payload.role;
        const impoundRepository = getRepository(ImpoundHandleVehicles);
        if (role_id === "6" || role_id === "1") {
            const _list = await impoundRepository
                .createQueryBuilder("impound_handle_vehicles")
                .select()
                .orderBy("impound_handle_vehicles.Id", "DESC")
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
        } else {
            const _list = await impoundRepository
                .createQueryBuilder("impound_handle_vehicles")
                .select()
                .where('impound_handle_vehicles.RoleId = :RoleId', {RoleId: role_id})
                .orderBy("impound_handle_vehicles.Id", "DESC")
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
        }

    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Internal Server Error",
        });
    }
}

export const getSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role_id = (req as any).auth.payload.role;
        if (role_id === "6" || role_id === "1") {
            const {returnDate, licensePlates, dateOfViolation, fullname, onHold, returned, officerReturns} = req.body;
            const impoundRepository = getRepository(ImpoundHandleVehicles);
            const _data = await impoundRepository
                .createQueryBuilder("impound_handle_vehicles")
                .select()
            if (returnDate) {
                _data.where("impound_handle_vehicles.ReturnDate = :returnDate", {returnDate: `%${formatDay(returnDate)}%`})
            }
            if (licensePlates) {
                _data.where("impound_handle_vehicles.LicensePlates ILIKE :licensePlates", {licensePlates: `%${licensePlates}%`})
            }
            if (dateOfViolation) {
                _data.where("impound_handle_vehicles.DateOfViolation = :dateOfViolation", {dateOfViolation: `%${formatDay(dateOfViolation)}%`})
            }
            if (fullname) {
                _data.where("impound_handle_vehicles.FullName ILIKE :fullname", {fullname: `%${fullname}%`})
            }
            if (onHold) {
                _data.where("impound_handle_vehicles.OnHold ILIKE :onHold", {onHold: `%${onHold}%`})
                    .andWhere('impound_handle_vehicles.RoleId = :RoleId', {RoleId: role_id})
            }
            if (returned) {
                _data.where("impound_handle_vehicles.Returned ILIKE :returned", {returned: `%${returned}%`})
            }
            if (officerReturns) {
                _data.where("impound_handle_vehicles.OfficerReturns ILIKE :officerReturns", {officerReturns: `%${officerReturns}%`})
            }
            const _list = await _data.orderBy("impound_handle_vehicles.Id", "ASC")
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
        } else {
            const {returnDate, licensePlates, dateOfViolation, fullname, onHold, returned, officerReturns} = req.body;
            const impoundRepository = getRepository(ImpoundHandleVehicles);
            const _data = await impoundRepository
                .createQueryBuilder("impound_handle_vehicles")
                .select()
            if (returnDate) {
                _data.where("impound_handle_vehicles.ReturnDate ILIKE :returnDate", {returnDate: `%${formatDay(returnDate)}%`})
                    .andWhere('impound_handle_vehicles.RoleId = :RoleId', {RoleId: role_id})
            }
            if (licensePlates) {
                _data.where("impound_handle_vehicles.LicensePlates ILIKE :licensePlates", {licensePlates: `%${licensePlates}%`})
                    .andWhere('impound_handle_vehicles.RoleId = :RoleId', {RoleId: role_id})
            }
            if (dateOfViolation) {
                _data.where("impound_handle_vehicles.DateOfViolation ILIKE :dateOfViolation", {dateOfViolation: `%${formatDay(dateOfViolation)}%`})
                    .andWhere('impound_handle_vehicles.RoleId = :RoleId', {RoleId: role_id})
            }
            if (fullname) {
                _data.where("impound_handle_vehicles.FullName ILIKE :fullname", {fullname: `%${fullname}%`})
                    .andWhere('impound_handle_vehicles.RoleId = :RoleId', {RoleId: role_id})
            }
            if (onHold) {
                _data.where("impound_handle_vehicles.OnHold ILIKE :onHold", {onHold: `%${onHold}%`})
                    .andWhere('impound_handle_vehicles.RoleId = :RoleId', {RoleId: role_id})
            }
            if (returned) {
                _data.where("impound_handle_vehicles.Returned ILIKE :returned", {returned: `%${returned}%`})
                    .andWhere('impound_handle_vehicles.RoleId = :RoleId', {RoleId: role_id})
            }
            if (officerReturns) {
                _data.where("impound_handle_vehicles.OfficerReturns ILIKE :officerReturns", {officerReturns: `%${officerReturns}%`})
                    .andWhere('impound_handle_vehicles.RoleId = :RoleId', {RoleId: role_id})
            }
            const _list = await _data.orderBy("impound_handle_vehicles.Id", "ASC")
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
        const impoundRepository = getRepository(ImpoundHandleVehicles);
        const id = Number(req.params.id);
        const role_id = (req as any).auth.payload.role;
        const {returnDate, licensePlates, dateOfViolation, fullname, onHold, returned, officerReturns} = req.body;
        const impoundHandle = await impoundRepository
            .createQueryBuilder("impound_handle_vehicles")
            .select()
            .where("impound_handle_vehicles.RoleId = :RoleId", {RoleId: role_id})
            .andWhere("impound_handle_vehicles.Id = :id", {id: id})
            .getOne()
        if (impoundHandle?.created_at === null) {
            return res.status(400).json({
                'error_code': 7,
                message: 'Editing error',
            });
        }
        ;
        if (checkDay(impoundHandle?.created_at) == true) {
            if (role_id === '1' || role_id === '6') {
                if (impoundHandle) {
                    impoundHandle.ReturnDate = formatDay(returnDate)
                    impoundHandle.LicensePlates = licensePlates
                    impoundHandle.DateOfViolation = formatDay(dateOfViolation)
                    impoundHandle.FullName = fullname
                    impoundHandle.OnHold = onHold
                    impoundHandle.Returned = returned
                    impoundHandle.OfficerReturns = officerReturns

                    impoundRepository.save(impoundHandle);
                    return res.status(200).json({
                        error_code: 0,
                        data: "Update successfully",
                    });
                } else {
                    return res
                        .status(404)
                        .json({message: "Impount handle vehicles not found"});
                }
            } else {
                return res.status(400).json({
                    error_code: 1,
                    data: "Currently you do not have permission to edit",
                });
            }

        } else {
            if (impoundHandle) {
                impoundHandle.ReturnDate = formatDay(returnDate)
                impoundHandle.LicensePlates = licensePlates
                impoundHandle.DateOfViolation = formatDay(dateOfViolation)
                impoundHandle.FullName = fullname
                impoundHandle.OnHold = onHold
                impoundHandle.Returned = returned
                impoundHandle.OfficerReturns = officerReturns

                impoundRepository.save(impoundHandle);
                return res.status(200).json({
                    error_code: 0,
                    data: "Update successfully",
                });
            } else {
                return res
                    .status(404)
                    .json({message: "Impount handle vehicles not found"});
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
        const impoundRepository = getRepository(ImpoundHandleVehicles)
        const role_id = (req as any).auth.payload.role;
        const isCheck = await impoundRepository
            .createQueryBuilder("impound_handle_vehicles")
            .select()
            .where("impound_handle_vehicles.RoleId = :RoleId", {RoleId: role_id})
            .andWhere("impound_handle_vehicles.Id = :id", {id: id})
            .getOne()

        if (isCheck) {
            console.log("Delete loading")
            impoundRepository.softDelete(id)

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
        const role_id = (req as any).auth.payload.role;
        const {startDay, endDay} = req.query
        if (startDay && endDay) {
            const formatStartDay = formatDay(startDay)
            const formatEndDay = formatDay(endDay)
            const impoundRepository = getRepository(ImpoundHandleVehicles)
            const items = await impoundRepository
                .createQueryBuilder("impound_handle_vehicles")
                .select()
                .where("impound_handle_vehicles.RoleId = :RoleId", {RoleId: role_id})
                .andWhere("impound_handle_vehicles.deletedAt is null")
                .andWhere("impound_handle_vehicles.created_at >= :formatStartDay ", {formatStartDay})
                .andWhere("impound_handle_vehicles.created_at <= :formatEndDay ", {formatEndDay})
                .orderBy("impound_handle_vehicles.Id", "DESC")
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
                {header: 'STT', key: 'Id', width: 10, color: 'blue'},
                {header: 'NGÀY TRẢ', key: 'ReturnDate', width: 30},
                {header: 'BIỂN KIỂM SOÁT', key: 'LicensePlates', width: 10},
                {header: 'NGÀY VI PHẠM', key: 'DateOfViolation', width: 30},
                {header: 'TÊN NGƯỜI VI PHẠM', key: 'FullName', width: 30},
                {header: 'ĐÃ TẠM GIỮ', key: 'OnHold', width: 15},
                {header: 'ĐÃ TRẢ LẠI', key: 'Returned', width: 15},
                {header: 'CÁN BỘ TRẢ', key: 'OfficerReturns', width: 15}

            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    ReturnDate: item.ReturnDate,
                    LicensePlates: item.LicensePlates,
                    DateOfViolation: item.DateOfViolation,
                    FullName: item.FullName,
                    OnHold: item.OnHold,
                    Returned: item.Returned,
                    OfficerReturns: item.OfficerReturns
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const impoundRepository = getRepository(ImpoundHandleVehicles)
            const items = await impoundRepository
                .createQueryBuilder("impound_handle_vehicles")
                .select()
                .where("impound_handle_vehicles.RoleId = :RoleId", {RoleId: role_id})
                .andWhere("impound_handle_vehicles.deletedAt is null")
                .orderBy("impound_handle_vehicles.Id", "DESC")
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
                {header: 'STT', key: 'Id', width: 10, color: 'blue'},
                {header: 'NGÀY TRẢ', key: 'ReturnDate', width: 30},
                {header: 'BIỂN KIỂM SOÁT', key: 'LicensePlates', width: 10},
                {header: 'NGÀY VI PHẠM', key: 'DateOfViolation', width: 30},
                {header: 'TÊN NGƯỜI VI PHẠM', key: 'FullName', width: 30},
                {header: 'ĐÃ TẠM GIỮ', key: 'OnHold', width: 15},
                {header: 'ĐÃ TRẢ LẠI', key: 'Returned', width: 15},
                {header: 'CÁN BỘ TRẢ', key: 'OfficerReturns', width: 15}
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    ReturnDate: item.ReturnDate,
                    LicensePlates: item.LicensePlates,
                    DateOfViolation: item.DateOfViolation,
                    FullName: item.FullName,
                    OnHold: item.OnHold,
                    Returned: item.Returned,
                    OfficerReturns: item.OfficerReturns
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