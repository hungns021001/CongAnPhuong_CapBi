import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { StatusBook } from "../../entity/StatusBook";
import { formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const Excel = require('exceljs');

export const createStatusBookHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {
            dateTime,
            personOnDuty,
            details,
            handler,
            note
        } = req.body;

        const statusBookRepository = getRepository(StatusBook)
        let statusBook = new StatusBook()
        statusBook.DateTime = formatDay(dateTime),
            statusBook.PersonOnDuty = personOnDuty,
            statusBook.Details = details,
            statusBook.Handler = handler,
            statusBook.Note = note

        statusBookRepository.save(statusBook);


        return res.json({
            'error_code': 0,
            'msg': 'success',
            data: statusBook
        });
    } catch (err: any) {
        console.error("create-shift: ", err);
        res.status(500).send({
            msg: "Get internal server error in create shift handler",
        });
    }
};

export const getStatusBook = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const statusBookRepository = getRepository(StatusBook)
        const _list = await statusBookRepository
            .createQueryBuilder("status_book")
            .select()
            .orderBy("status_book.Id", "DESC")
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
        console.error("get_status_book: ", err);
        res.status(500).send({
            msg: "Get internal server error in get status book",
        });
    }
};

export const getStatusBookByName = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {
            dateTime,
            personOnDuty,
            details,
            handler,
            note
        } = req.body;
        const statusBookRepository = getRepository(StatusBook)
        const search = await statusBookRepository
            .createQueryBuilder('status_book')
            .select()

        if (dateTime)
            search.where("status_book.DateTime =:dateTime", { dateTime: `${formatDay(dateTime)}` })
        if (personOnDuty)
            search.where("status_book.PersonOnDuty ILIKE :personOnDuty", { personOnDuty: `%${personOnDuty}%` })
        if (details)
            search.where("status_book.Details ILIKE :details", { details: `%${details}%` })
        if (handler)
            search.where("status_book.Handler ILIKE :handler", { handler: `%${handler}%` })
        if (note)
            search.where("status_book.Note ILIKE :note", { note: `%${note}%` })

        const _data = await search.orderBy("status_book.Id", "ASC")
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
                'msg': 'status book not found',
            })
        }
    } catch (err: any) {
        console.error("get_status_book_by_id: ", err);
        res.status(500).send({
            msg: "Get internal server error in get status book by id",
        });
    }
};

export const updateStatusBookHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const statusBookRepository = getRepository(StatusBook)
        const statusBookId = Number(req.params.id)
        const {
            dateTime,
            personOnDuty,
            details,
            handler,
            note
        } = req.body;

        const statusBook = await statusBookRepository.findOneBy({ Id: statusBookId })

        if (statusBook) {
            statusBook.DateTime = formatDay(dateTime),
                statusBook.PersonOnDuty = personOnDuty,
                statusBook.Details = details,
                statusBook.Handler = handler,
                statusBook.Note = note
            statusBookRepository.save(statusBook)

            return res.status(200).json({
                'error_code': 0,
                message: 'Update successfully',
                data: statusBook
            });
        } else {
            return res.status(404).json({ message: "statusBook not found" });
        }

    } catch (err: any) {
        console.error("create-shift: ", err);
        res.status(500).send({
            msg: "Get internal server error in update statusBook handler",
        });
    }
};

export const destroyHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id)
        const statusBookRepository = getRepository(StatusBook)
        const isCheck = await statusBookRepository.findOneBy({ Id: id })

        if (isCheck) {
            console.log("Delete loading")
            statusBookRepository.softDelete(id)

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
            const statusBookRepository = getRepository(StatusBook)
            const items = await statusBookRepository
                .createQueryBuilder("status_book")
                .select()
                .where("status_book.deletedAt is null")
                .andWhere("status_book.createdAt >= :formatStartDay ", { formatStartDay })
                .andWhere("status_book.createdAt <= :formatEndDay ", { formatEndDay })
                .orderBy("status_book.Id", "DESC")
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
                { header: 'NGÀY THÁNG', key: 'DateTime', width: 10, color: 'blue' },
                { header: 'NGƯỜI TRỰC', key: 'PersonOnDuty', width: 30 },
                { header: 'NGƯỜI XỬ LÝ', key: 'Handler', width: 10 },
                { header: 'NỘI DUNG TÌNH HÌNH', key: 'Details', width: 30 },
                { header: 'GHI CHÚ', key: 'Note', width: 30 }
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    DateTime: item.DateTime,
                    PersonOnDuty: item.PersonOnDuty,
                    Handler: item.Handler,
                    Details: item.Details,
                    Note: item.Note
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const statusBookRepository = getRepository(StatusBook)
            const items = await statusBookRepository
                .createQueryBuilder("status_book")
                .select()
                .where("status_book.deletedAt is null")
                .orderBy("status_book.Id", "DESC")
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
                { header: 'NGÀY THÁNG', key: 'DateTime', width: 10, color: 'blue' },
                { header: 'NGƯỜI TRỰC', key: 'PersonOnDuty', width: 30 },
                { header: 'NGƯỜI XỬ LÝ', key: 'Handler', width: 10 },
                { header: 'NỘI DUNG TÌNH HÌNH', key: 'Details', width: 30 },
                { header: 'GHI CHÚ', key: 'Note', width: 30 }
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    DateTime: item.DateTime,
                    PersonOnDuty: item.PersonOnDuty,
                    Handler: item.Handler,
                    Details: item.Details,
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

