import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { DispatchBook } from "../../entity/DispatchBook";
import { formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const Excel = require('exceljs');

export const createDispatchHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {

        const { dateTime,
            dispatchID,
            releaseDate,
            subject,
            agencyissued,
            receiver
            } = req.body;

        const dispatchRepository = getRepository(DispatchBook)
        let dispatch = new DispatchBook()
        dispatch.Datetime = formatDay(dateTime),
        dispatch.DispatchID = dispatchID,
        dispatch.ReleaseDate = formatDay(releaseDate),
        dispatch.Subject = subject,
        dispatch.AgencyIssued = agencyissued,
        dispatch.Receiver = receiver
        
        dispatchRepository.save(dispatch);
        
        return res.json({
            'error_code': 0,
            'msg': 'success',
            data: dispatch
        });        
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error in create dispatch book handler",
        });
    }
};

export const getDispatchBook = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const dispatchRepository = getRepository(DispatchBook)
        const _list = await dispatchRepository
        .createQueryBuilder("dispatch_book")
        .select()
        .orderBy("dispatch_book.Id","DESC")
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
                'totalPage': total}
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};

export const getDispatchByReceiver = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {dateTime, dispatchId, releaseDate, subject, agencyIssued, receiver } = req.body
        const dispatchRepository = getRepository(DispatchBook)
        const search = await dispatchRepository
                    .createQueryBuilder('dispatch_book')
                    .select()
        
        if (dateTime) {
            search.where("dispatch_book.Datetime =:dateTime", {dateTime: `${formatDay(dateTime)}`})
        }
        if (dispatchId) {
            search.where("dispatch_book.DispatchID ILIKE :dispatchId", {dispatchId: `%${dispatchId}%`})
        }
        if (releaseDate) {
            search.where("dispatch_book.ReleaseDate =:releaseDate", {releaseDate: `${formatDay(releaseDate)}`})
        }
        if (subject) {
            search.where("dispatch_book.Subject ILIKE :subject", {subject: `%${subject}%`})
        }
        if (agencyIssued) {
            search.where("dispatch_book.AgencyIssued ILIKE :agencyIssued", {agencyIssued: `%${agencyIssued}%`})
        }
        if(receiver) {
            search.where("dispatch_book.Receiver ILIKE :receiver", { receiver: `%${receiver}%` })
        }
                    
        const _data = await search.orderBy("dispatch_book.Id","ASC")
                    .getMany()

        if(_data) {
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
                'msg': 'ID Dispatch Book not found',
            })
        }
    } catch (err: any) {
        console.error("get_dispatch_by_id: ", err);
        res.status(500).send({
            msg: "Get internal server error in get immigrant by id",
        });
    }
};

export const updateDispatchHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const dispatchRepository = getRepository(DispatchBook)
        const dispatchId = Number(req.params.id)
        const { dateTime,
            dispatchID,
            releaseDate,
            subject,
            agencyissued,
            receiver
            } = req.body;

        const dispatch = await dispatchRepository.findOneBy({Id: dispatchId})

        if (dispatch) {
            dispatch.Datetime = formatDay(dateTime),
            dispatch.DispatchID = dispatchID,
            dispatch.ReleaseDate = formatDay(releaseDate),
            dispatch.Subject = subject,
            dispatch.AgencyIssued = agencyissued,
            dispatch.Receiver = receiver

            dispatchRepository.save(dispatch)

            return res.status(200).json({
                'error_code': 0,
                message: 'Update successfully',
                data: dispatch
            });
        } else {
            return res.status(404).json({ message: "Dispatch Book not found" });
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
        const dispatchRepository = getRepository(DispatchBook)
        const isCheck = await dispatchRepository.findOneBy({Id:  id })

        if (isCheck) {
            dispatchRepository.softDelete(id)

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
            const dispatchRepository = getRepository(DispatchBook)
            const items = await dispatchRepository
                .createQueryBuilder("dispatch_book")
                .select()
                .where("dispatch_book.deletedAt is null")
                .andWhere("dispatch_book.createdAt >= :formatStartDay ", { formatStartDay })
                .andWhere("dispatch_book.createdAt <= :formatEndDay ", { formatEndDay })
                .orderBy("dispatch_book.Id", "DESC")
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
                { header: 'NGÀY THÁNG NĂM', key: 'Datetime', width: 30 },
                { header: 'SỐ CÔNG VĂN', key: 'DispatchID', width: 10 },
                { header: 'CƠ QUAN BAN HÀNH', key: 'AgencyIssued', width: 30 },
                { header: 'NGÀY BAN HÀNH', key: 'ReleaseDate', width: 30 },
                { header: 'TRÍCH YẾU', key: 'Subject', width: 15 },
                { header: 'NGƯỜI NHẬN', key: 'Receiver', width: 15 },
  
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    Datetime: item.Datetime,
                    DispatchID: item.DispatchID,
                    AgencyIssued: item.AgencyIssued,
                    ReleaseDate: item.ReleaseDate,
                    Subject: item.Subject,
                    Receiver: item.Receiver
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const dispatchRepository = getRepository(DispatchBook)
            const items = await dispatchRepository
                .createQueryBuilder("dispatch_book")
                .select()
                .where("dispatch_book.deletedAt is null")
                .orderBy("dispatch_book.Id", "DESC")
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
                { header: 'NGÀY THÁNG NĂM', key: 'Datetime', width: 30 },
                { header: 'SỐ CÔNG VĂN', key: 'DispatchID', width: 10 },
                { header: 'CƠ QUAN BAN HÀNH', key: 'AgencyIssued', width: 30 },
                { header: 'NGÀY BAN HÀNH', key: 'ReleaseDate', width: 30 },
                { header: 'TRÍCH YẾU', key: 'Subject', width: 15 },
                { header: 'NGƯỜI NHẬN', key: 'Receiver', width: 15 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    Datetime: item.Datetime,
                    DispatchID: item.DispatchID,
                    AgencyIssued: item.AgencyIssued,
                    ReleaseDate: item.ReleaseDate,
                    Subject: item.Subject,
                    Receiver: item.Receiver
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