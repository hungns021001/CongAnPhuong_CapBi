import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { NotHandle } from "../../entity/NotHandle";
import { formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const Excel = require('exceljs');

export const createNotHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {
            dateOfViolation,
            violation,
            locationViolation,
            lisencePlate,
            nameViolator,
            nameBailsman,
            solCommander,
            staffReceive
        } = req.body;

        const nothandleRepository = getRepository(NotHandle)
        let nothandle = new NotHandle()
        nothandle.DateOfViolation = formatDay(dateOfViolation);
        nothandle.Violation = violation;
        nothandle.LocationViolation = locationViolation;
        nothandle.LisencePlate = lisencePlate;
        nothandle.NameViolator = nameViolator;
        nothandle.NameBailsman = nameBailsman;
        nothandle.SolCommander = solCommander;
        nothandle.StaffReceive = staffReceive;
        nothandleRepository.save(nothandle);

        return res.json({
            'error_code': 0,
            'msg': 'success',
            data: nothandle
        });
    } catch (err: any) {
        console.error("create-passport: ", err);
        res.status(500).send({
            msg: "Get internal server error in create nothandle",
        });
    }
};

export const getNotHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const notHandleRepository = getRepository(NotHandle)
        const _list = await notHandleRepository
            .createQueryBuilder("not_handle")
            .select()
            .orderBy("not_handle", "DESC")
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
        console.error("get-passport: ", err);
        res.status(500).send({
            msg: "Get internal server error in get nothandle",
        });
    }
};

export const getnothandleByAddress = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {
            dateOfViolation,
            violation,
            locationViolation,
            lisencePlate,
            nameViolator,
            nameBailsman,
            solCommander,
            staffReceive
        } = req.body;
        const nothandleRepository = getRepository(NotHandle)
        const search = await nothandleRepository
            .createQueryBuilder('not_handle')
            .select()
        if (dateOfViolation)
            search.where("not_handle.DateOfViolation =:dateOfViolation", { dateOfViolation: `${formatDay(dateOfViolation)}` })
        if (violation)
            search.where("not_handle.Violation ILIKE :violation", { violation: `%${violation}%` })
        if (locationViolation)
            search.where("not_handle.LocationViolation ILIKE :locationViolation", { locationViolation: `%${locationViolation}%` })
        if (lisencePlate)
            search.where("not_handle.LisencePlate ILIKE :lisencePlate", { lisencePlate: `%${lisencePlate}%` })
        if (nameViolator)
            search.where("not_handle.NameViolator ILIKE :nameViolator", { nameViolator: `%${nameViolator}%` })
        if (nameBailsman)
            search.where("not_handle.NameBailsman ILIKE :nameBailsman", { nameBailsman: `%${nameBailsman}%` })
        if (solCommander)
            search.where("not_handle.SolCommander ILIKE :solCommander", { solCommander: `%${solCommander}%` })
        if (staffReceive)
            search.where("not_handle.StaffReceive ILIKE :staffReceive", { staffReceive: `%${staffReceive}%` })
        const _data = await search.orderBy("not_handle", "ASC")
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
                'msg': 'nothandle not found',
            })
        }
    } catch (err: any) {
        console.error("get_nothandle_by_id: ", err);
        res.status(500).send({
            msg: "Get internal server error in get nothandle by id",
        });
    }
};

export const updateNotHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const nothandleRepository = getRepository(NotHandle)
        const nodehandleId = Number(req.params.id)
        const {
            dateOfViolation,
            violation,
            locationViolation,
            lisencePlate,
            nameViolator,
            nameBailsman,
            solCommander,
            staffReceive
        } = req.body;

        const nothandle = await nothandleRepository.findOneBy({ Id: nodehandleId })

        if (nothandle) {
            nothandle.DateOfViolation = formatDay(dateOfViolation);
            nothandle.Violation = violation;
            nothandle.LocationViolation = locationViolation;
            nothandle.LisencePlate = lisencePlate;
            nothandle.NameViolator = nameViolator;
            nothandle.NameBailsman = nameBailsman;
            nothandle.SolCommander = solCommander;
            nothandle.StaffReceive = staffReceive;

            nothandleRepository.save(nothandle);

            return res.status(200).json({
                'error_code': 0,
                message: 'Update successfully',
                data: nothandle
            });
        } else {
            return res.status(404).json({ message: "NotHandle not found" });
        }

    } catch (err: any) {
        console.error("update nothandle: ", err);
        res.status(500).send({
            msg: "Get internal server error in update nothandle",
        });
    }
};

export const destroyHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const nothandleRepository = getRepository(NotHandle);
        const isCheck = await nothandleRepository.findOneBy({ Id: id })

        if (isCheck) {
            nothandleRepository.softDelete(id)

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
            msg: "Get internal server error in delete NotHandle",
        });
    }
};
export const exportToExcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { startDay, endDay } = req.query
        if (startDay && endDay) {
            const formatStartDay = formatDay(startDay)
            const formatEndDay = formatDay(endDay)
            const notHandleRepository = getRepository(NotHandle)
            const items = await notHandleRepository
                .createQueryBuilder("not_handle")
                .select()
                .where("not_handle.deletedAt is null")
                .andWhere("not_handle.createdAt >= :formatStartDay ", { formatStartDay })
                .andWhere("not_handle.createdAt <= :formatEndDay ", { formatEndDay })
                .orderBy("not_handle.Id", "DESC")
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
                { header: 'BIỂN KIỂM SOÁT', key: 'LisencePlate', width: 30 },
                { header: 'NGÀY VI PHẠM', key: 'DateofViolation', width: 10 },
                { header: 'ĐỊA ĐIỂM VI PHẠM', key: 'LocationViolation', width: 30 },
                { header: 'LỖI VI PHẠM', key: 'Violation', width: 30 },
                { header: 'TÊN NGƯỜI VI PHẠM', key: 'NameViolator', width: 15 },
                { header: 'TÊN NGƯỜI XIN', key: 'NameBailsman', width: 15 },
                { header: 'CHỈ HUY GIẢI QUYẾT', key: 'SolCommander', width: 50 },
                { header: 'CÁN BỘ NHẬN GIẤY DÁN', key: 'StaffReceive', width: 30 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    LisencePlate: item.LisencePlate,
                    DateofViolation: item.DateOfViolation,
                    LocationViolation: item.LocationViolation,
                    Violation: item.Violation,
                    NameViolator: item.NameViolator,
                    NameBailsman: item.NameBailsman,
                    SolCommander: item.SolCommander,
                    StaffReceive: item.StaffReceive
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const notHandleRepository = getRepository(NotHandle)
            const items = await notHandleRepository
                .createQueryBuilder("not_handle")
                .select()
                .where("not_handle.deletedAt is null")
                .orderBy("not_handle.Id", "DESC")
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
                { header: 'BIỂN KIỂM SOÁT', key: 'LisencePlate', width: 30 },
                { header: 'NGÀY VI PHẠM', key: 'DateofViolation', width: 10 },
                { header: 'ĐỊA ĐIỂM VI PHẠM', key: 'LocationViolation', width: 30 },
                { header: 'LỖI VI PHẠM', key: 'Violation', width: 30 },
                { header: 'TÊN NGƯỜI VI PHẠM', key: 'NameViolator', width: 15 },
                { header: 'TÊN NGƯỜI XIN', key: 'NameBailsman', width: 15 },
                { header: 'CHỈ HUY GIẢI QUYẾT', key: 'SolCommander', width: 50 },
                { header: 'CÁN BỘ NHẬN GIẤY DÁN', key: 'StaffReceive', width: 30 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    LisencePlate: item.LisencePlate,
                    DateofViolation: item.DateOfViolation,
                    LocationViolation: item.LocationViolation,
                    Violation: item.Violation,
                    NameViolator: item.NameViolator,
                    NameBailsman: item.NameBailsman,
                    SolCommander: item.SolCommander,
                    StaffReceive: item.StaffReceive
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