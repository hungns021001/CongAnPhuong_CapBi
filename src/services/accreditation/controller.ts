import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {VehicleAccreditation} from "../../entity/VehicleAccreditation";
import {formatDay, paginationHandle, totalPage} from "../../libs/common/pagination";

const Excel = require('exceljs');

export const createVehicleAccreditation = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const {dateSend, licensePlates, violation, receiver, finePaymentDate, images} =
            req.body;
        const dateSendFormat = formatDay(dateSend);
        const imagePaths = (req.files as Express.Multer.File[])?.map(file => file['path']) ?? [];
        console.log("image names:", req.files);
        console.log('imagesssss',images);
        


        const finePaymentDateFormat = formatDay(finePaymentDate);
        const accreditationRepository = getRepository(VehicleAccreditation);
        let accreditation = new VehicleAccreditation();
        accreditation.DateSend = dateSendFormat;
        accreditation.LicensePlates = licensePlates;
        accreditation.Violation = violation;
        accreditation.Receiver = receiver;
        accreditation.FinePaymentDate = finePaymentDateFormat;
        const imagesString = `[ ${imagePaths.map(path => `'${path.replace('tmp/uploads/', 'https://capbi.onrender.com/')}'`).join(', ')} ]`;
        accreditation.Images = imagesString;

        await accreditationRepository.save(accreditation);
        return res.json({
            error_code: 0,
            msg: "success",
            data: accreditation
        });
    } catch (err: any) {
        console.error("create-vehicle-accreditation: ", err);
        res.status(500).send({
            msg: "Get internal server error in create Vehicle Accreditation",
        });
    }
};

export const getVehicleAccreditation = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const accreditationRepository = getRepository(VehicleAccreditation);
        const _list = await accreditationRepository
            .createQueryBuilder("vehicle_accreditation")
            .select()
            .orderBy("vehicle_accreditation.Id", "DESC")
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
        console.error("get-vehicle-accreditation: ", err);
        res.status(500).send({
            msg: "Get internal server error in get Vehicle Accreditation",
        });
    }
};

export const getVehicleAccreditationByReceiver = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const {receiver, licensePlates, violation, dateSend, finePaymentDate} = req.body;

        const accreditationRepository = getRepository(VehicleAccreditation);
        const _data = await accreditationRepository
            .createQueryBuilder("vehicle_accreditation")
            .select()
        console.log("receiver:", receiver);
        console.log("licensePlates:", licensePlates);
        console.log("violation:", violation);
        console.log("dateSend:", dateSend);
        console.log("finePaymentDate:", finePaymentDate);


        if (receiver) {
            _data.where("vehicle_accreditation.Receiver ILIKE :receiver", {receiver: `%${receiver}%`})
        }
        if (licensePlates) {
            _data.where("vehicle_accreditation.LicensePlates ILIKE :licensePlates", {licensePlates: `%${licensePlates}%`})
        }
        if (violation) {
            _data.where("vehicle_accreditation.Violation ILIKE :violation", {violation: `%${violation}%`})
        }
        if (dateSend) {
            _data.where("vehicle_accreditation.DateSend =:dateSend", {dateSend: `%${formatDay(dateSend)}%`})
        }
        if (finePaymentDate) {
            _data.where("vehicle_accreditation.FinePaymentDate =:finePaymentDate", {finePaymentDate: `%${formatDay(finePaymentDate)}%`})
        }

        const _list = await _data.orderBy("vehicle_accreditation.Id", "ASC")
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
                msg: "Vehicle Accreditation not found",
            });
        }
    } catch (err: any) {
        console.error("get_VehicleAccreditation_by_id: ", err);
        res.status(500).send({
            msg: "Get internal server error in get Vehicle Accreditation by id",
        });
    }
};

export const updateVehicleAccreditation = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const accreditationRepository = getRepository(VehicleAccreditation);
        const accredidationId = Number(req.params.id);
        const {dateSend, licensePlates, violation, receiver, finePaymentDate} =
            req.body;
        const dateSendFormat = formatDay(dateSend);
        const imagePaths = (req.files as Express.Multer.File[])?.map(file => file['path']) ?? [];
        const finePaymentDateFormat = formatDay(finePaymentDate);
        const accreditation = await accreditationRepository.findOneBy({
            Id: accredidationId,
        });
        if (accreditation) {
            accreditation.DateSend = dateSendFormat;
            accreditation.LicensePlates = licensePlates;
            accreditation.Violation = violation;
            accreditation.Receiver = receiver;
            accreditation.FinePaymentDate = finePaymentDateFormat;
            const imagesString = `[ ${imagePaths.map(path => `'${path.replace('tmp/uploads/', 'https://capbi.onrender.com/')}'`).join(', ')} ]`;
            console.log('imagesString',imagesString);
            
            accreditation.Images = imagesString;

            await accreditationRepository.save(accreditation);
            return res.status(200).json({
                error_code: 0,
                data: "Update successfully",
            });
        } else {
            return res
                .status(404)
                .json({message: "Vehicle Accreditation not found"});
        }
    } catch (err: any) {
        console.error("Update Vehicle Accreditation: ", err);
        res.status(500).send({
            msg: "Get internal server error in update Vehicle Accreditation",
        });
    }
};

export const destroyAccreditation = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = Number(req.params.id);
        const accreditationRepository = getRepository(VehicleAccreditation);
        const isCheck = await accreditationRepository.findOneBy({Id: id});

        if (isCheck) {
            accreditationRepository.softDelete(id);
            return res.status(200).json({
                error_code: 0,
                msg: "Deleted successfully",
            });
        } else {
            return res.status(404).json({
                error_code: 2,
                msg: "ID not found",
            });
        }
    } catch (err: any) {
        console.error("delete-shift: ", err);
        res.status(500).send({
            msg: "Get internal server error in delete Vehicle Accreditation",
        });
    }
};
export const exportToExcel = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const {startDay, endDay} = req.query
        if (startDay && endDay) {
            const formatStartDay = formatDay(startDay)
            const formatEndDay = formatDay(endDay)
            const accreditationRepository = getRepository(VehicleAccreditation)
            const items = await accreditationRepository
                .createQueryBuilder("vehicle_accreaditation")
                .select()
                .where("vehicle_accreaditation.deletedAt is null")
                .andWhere("vehicle_accreaditation.createdAt >= :formatStartDay ", {formatStartDay})
                .andWhere("vehicle_accreaditation.createdAt <= :formatEndDay ", {formatEndDay})
                .orderBy("vehicle_accreaditation.Id", "DESC")
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
                {header: 'BIỂN SỐ XE', key: 'LicensePlates', width: 30},
                {header: 'LỖI VI PHẠM', key: 'Violation', width: 10},
                {header: 'NGÀY THÁNG GỬI', key: 'DateSend', width: 30},
                {header: 'NGÀY THÁNG NỘP PHẠT', key: 'FinePaymentDate', width: 30},
                {header: 'NGƯỜI NHẬN', key: 'Receiver', width: 15},
                {header: 'HÌNH ẢNH VI PHẠM', key: 'Images', width: 15},

            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    LicensePlates: item.LicensePlates,
                    Violation: item.Violation,
                    DateSend: item.DateSend,
                    FinePaymentDate: item.FinePaymentDate,
                    Receiver: item.Receiver,
                    Images: item.Images
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const accreditationRepository = getRepository(VehicleAccreditation)
            const items = await accreditationRepository
                .createQueryBuilder("vehicle_accreaditation")
                .select()
                .where("vehicle_accreaditation.deletedAt is null")
                .orderBy("vehicle_accreaditation.Id", "DESC")
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
                {header: 'BIỂN SỐ XE', key: 'LicensePlates', width: 30},
                {header: 'LỖI VI PHẠM', key: 'Violation', width: 10},
                {header: 'NGÀY THÁNG GỬI', key: 'DateSend', width: 30},
                {header: 'NGÀY THÁNG NỘP PHẠT', key: 'FinePaymentDate', width: 30},
                {header: 'NGƯỜI NHẬN', key: 'Receiver', width: 15},
                {header: 'HÌNH ẢNH VI PHẠM', key: 'Images', width: 15},
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    LicensePlates: item.LicensePlates,
                    Violation: item.Violation,
                    DateSend: item.DateSend,
                    FinePaymentDate: item.FinePaymentDate,
                    Receiver: item.Receiver,
                    Images: item.Images
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
