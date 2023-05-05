import {NextFunction, Request, Response} from "express";
import {EntityManager, getManager, getRepository} from "typeorm";
import {HandlingViolations} from "../../entity/Handling";
import {formatDay, paginationHandle, totalPage} from "../../libs/common/pagination";

const Excel = require('exceljs');

export const createHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {
            dateViolation,
            addressViolation,
            nameOfViolation,
            content,
            directiveInformation,
            fullnamePolice,
            result
        } = req.body;
        const imagePaths = (req.files as Express.Multer.File[])?.map(file => file['path']) ?? [];
        const handlingRepository = getRepository(HandlingViolations)
        let handling = new HandlingViolations();
        handling.DateViolation = formatDay(dateViolation);
        handling.AddressViolation = addressViolation;
        handling.NameOfViolation = nameOfViolation;
        handling.Content = content;
        handling.DirectiveInformation = directiveInformation;
        handling.FullNamePolice = fullnamePolice;
        handling.Result = result;
        const imagesString = `[ ${imagePaths.map(path => `'${path.replace('tmp/uploads/', 'https://capbi.onrender.com/')}'`).join(', ')} ]`;
        handling.Images = imagesString;

        handlingRepository.save(handling);
        return res.status(200).json({
            'error_code': 0,
            'msg': 'success',
            data: handling
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};

export const getHandling = async function (req: Request, res: Response, next: NextFunction) {
    try {

        const handlingRepository = getRepository(HandlingViolations)
        const _list = await handlingRepository
            .createQueryBuilder("handling_violations")
            .select()
            .orderBy("handling_violations.Id", "DESC")
            .getMany()

        const page = Number(req.query.page) || 1
        const list_data = paginationHandle(page, _list)
        const total = totalPage(_list.length)
        if (_list.length === 0) {
            return res.status(200).json({
                'error_code': 4,
                'msg': 'Data Not Found',
                data: []
            });
        }

        return res.status(200).json({
            'error_code': 0,
            'msg': 'success',
            data: {
                "list_data": list_data,
                total_page: total
            }
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};

export const getHandlingByName = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {
            dateViolation,
            addressViolation,
            nameOfViolation,
            content,
            directiveInformation,
            fullnamePolice,
            result
        } = req.body
        const handlingRepository = getRepository(HandlingViolations)
        const search = await handlingRepository
            .createQueryBuilder('handling_violations')
            .select()

        if (dateViolation) {
            search.where("handling_violations.DateViolation =:dateViolation", {dateViolation: `${formatDay(dateViolation)}`})
        }
        if (addressViolation) {
            search.where("handling_violations.AddressViolation ILIKE :addressViolation", {addressViolation: `%${addressViolation}%`})
        }
        if (nameOfViolation) {
            search.where("handling_violations.NameOfViolation ILIKE :nameOfViolation", {nameOfViolation: `%${nameOfViolation}%`})
        }
        if (content) {
            search.where("handling_violations.Content ILIKE :content", {content: `%${content}%`})
        }
        if (directiveInformation) {
            search.where("handling_violations.DirectiveInformation ILIKE :directiveInformation", {directiveInformation: `%${directiveInformation}%`})
        }
        if (fullnamePolice) {
            search.where("handling_violations.FullNamePolice ILIKE :fullnamePolice", {fullnamePolice: `%${fullnamePolice}%`})
        }
        if (result) {
            search.where("handling_violations.Result ILIKE :result", {result: `%${result}%`})
        }

        const _data = await search.orderBy("handling_violations.Id", "ASC")
            .getMany()

        if (_data) {
            const page = Number(req.query.page) || 1
            const list_data = paginationHandle(page, _data)
            const total = totalPage(_data.length)
            return res.status(200).json({
                'error_code': 0,
                'msg': 'success',
                data: {
                    "list_data": list_data,
                    totalPage: total
                }
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

export const updateHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const handlingRepository = getRepository(HandlingViolations)
        const id = Number(req.params.id)
        const {
            dateViolation,
            addressViolation,
            nameOfViolation,
            content,
            directiveInformation,
            fullnamePolice,
            result
        } = req.body;
        const imagePaths = (req.files as Express.Multer.File[])?.map(file => file['path']) ?? [];
        const handling = await handlingRepository.findOneBy({Id: id})

        if (handling) {
            handling.DateViolation = formatDay(dateViolation);
            handling.AddressViolation = addressViolation;
            handling.NameOfViolation = nameOfViolation;
            handling.Content = content;
            handling.DirectiveInformation = directiveInformation;
            handling.FullNamePolice = fullnamePolice;
            handling.Result = result;
            const imagesString = `[ ${imagePaths.map(path => `'${path.replace('tmp/uploads/', 'https://capbi.onrender.com/')}'`).join(', ')} ]`;
            handling.Images = imagesString;

            await handlingRepository.save(handling)

            return res.status(200).json({
                'error_code': 0,
                message: 'Update successfully',
                data: handling
            });
        } else {
            return res.status(404).json({message: "ID not found"});
        }

    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error ",
        });
    }
};

export const destroyHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id)
        const handlingRepository = getRepository(HandlingViolations)
        const isCheck = await handlingRepository.findOneBy({Id: id})

        if (isCheck) {
            console.log("Delete loading")
            handlingRepository.softDelete(id)

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

        const {startDay, endDay} = req.query
        if (startDay && endDay) {
            const formatStartDay = formatDay(startDay)
            const formatEndDay = formatDay(endDay)
            const handlingRepository = getRepository(HandlingViolations)
            const items = await handlingRepository
                .createQueryBuilder("handling_violations")
                .select()
                .where("handling_violations.deletedAt is null")
                .andWhere("handling_violations.created_at >= :formatStartDay ", {formatStartDay})
                .andWhere("handling_violations.created_at <= :formatEndDay ", {formatEndDay})
                .orderBy("handling_violations.Id", 'DESC')
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
                {header: 'NGÀY XẢY RA', key: 'DateViolation', width: 30},
                {header: 'TÊN VỤ VIỆC', key: 'NameOfViolation', width: 10},
                {header: 'ĐỊA ĐIỂM XẢY RA', key: 'AddressViolation', width: 30},
                {header: 'NỘI DUNG', key: 'Content', width: 30},
                {header: 'CÁN BỘ THỤ LÝ', key: 'FullNamePolice', width: 15},
                {header: 'KẾT QUẢ XỬ LÝ', key: 'Result', width: 15},
                {header: 'HÌNH ẢNH ĐỐI TƯỢNG VI PHẠM', key: 'Images', width: 15}
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    DateViolation: item.DateViolation,
                    NameOfViolation: item.NameOfViolation,
                    AddressViolation: item.AddressViolation,
                    Content: item.Content,
                    FullNamePolice: item.FullNamePolice,
                    Result: item.Result,
                    Images: item.Images
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const handlingRepository = getRepository(HandlingViolations)
            const items = await handlingRepository
                .createQueryBuilder("handling_violations")
                .select()
                .where("handling_violations.deletedAt is null")
                .orderBy("handling_violations.Id", "DESC")
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
                {header: 'NGÀY XẢY RA', key: 'DateViolation', width: 30},
                {header: 'TÊN VỤ VIỆC', key: 'NameOfViolation', width: 10},
                {header: 'ĐỊA ĐIỂM XẢY RA', key: 'AddressViolation', width: 30},
                {header: 'NỘI DUNG', key: 'Content', width: 30},
                {header: 'CÁN BỘ THỤ LÝ', key: 'FullNamePolice', width: 15},
                {header: 'KẾT QUẢ XỬ LÝ', key: 'Result', width: 15},
                {header: 'HÌNH ẢNH ĐỐI TƯỢNG VI PHẠM', key: 'Images', width: 15}
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    DateViolation: item.DateViolation,
                    NameOfViolation: item.NameOfViolation,
                    AddressViolation: item.AddressViolation,
                    Content: item.Content,
                    FullNamePolice: item.FullNamePolice,
                    Result: item.Result,
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