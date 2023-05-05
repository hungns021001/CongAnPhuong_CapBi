import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { DocumentTracking } from "../../entity/DocumentTracking";
import { formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const Excel = require('exceljs');
const moment = require("moment");

export const createDocumentTrackerHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {

        const {
            dispatchID,
            releaseDate,
            subject,
            signer,
            recipients
        } = req.body;

        const trackerRepository = getRepository(DocumentTracking)
        let tracker = new DocumentTracking()
        const datecreate = new Date();
        const someDate = moment(datecreate).format("YYYY-MM-DD HH:mm:ss");
        if(!releaseDate){
            return res.status(404).json({
                'error_code': 2,
                'msg': 'Datetime not found',
            })            
        }   
        tracker.DispatchID = dispatchID,
        tracker.ReleaseDate = formatDay(releaseDate),
        tracker.Subject = subject,
        tracker.Signer = signer,
        tracker.Recipients = recipients
        tracker.createdAt = someDate
        trackerRepository.save(tracker);
        return res.json({
            'error_code': 0,
            'msg': 'success',
            data: tracker
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error in create document tracker handler",
        });
    }
};

export const getDocumentTracking = async function (req: Request, res: Response, next: NextFunction) {
    try {

        const trackerRepository = getRepository(DocumentTracking)
        const _list = await trackerRepository
            .createQueryBuilder("document_tracking")
            .select()
            .orderBy("document_tracking.Id", "DESC")
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
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};

export const getDocumentTrackingByName = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {
            dispatchID,
            releaseDate,
            subject,
            signer,
            recipients
        } = req.body;
        const trackerRepository = getRepository(DocumentTracking)
        const search = await trackerRepository
            .createQueryBuilder('document_tracking')
            .select()
        if (dispatchID)
            search.where('document_tracking."DispatchID" ILIKE :dispatchID', { dispatchID: `%${dispatchID}%` });
        if (releaseDate)
            search.where("document_tracking.ReleaseDate =:releaseDate", { releaseDate: `${formatDay(releaseDate)}` });
        if (subject)
            search.where("document_tracking.Subject ILIKE :subject", { subject: `%${subject}%` });
        if (signer)
            search.where("document_tracking.Signer ILIKE :signer", { signer: `%${signer}%` });
        if (recipients)
            search.where("document_tracking.Recipients ILIKE :recipients", { recipients: `%${recipients}%` });

        const _data = await search.orderBy('document_tracking.Id', "ASC")
            .getMany();

        if (_data.length > 0) {
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
                'msg': 'Document Tracking not found',
            })
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};

export const updateDocumentTrackerHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const trackerRepository = getRepository(DocumentTracking)
        const shiftId = Number(req.params.id)
        const {
            dispatchID,
            releaseDate,
            subject,
            signer,
            recipients
        } = req.body;

        const tracker = await trackerRepository.findOneBy({ Id: shiftId })

        if (tracker) {
                tracker.DispatchID = dispatchID,
                tracker.ReleaseDate = formatDay(releaseDate),
                tracker.Subject = subject,
                tracker.Signer = signer,
                tracker.Recipients = recipients

            trackerRepository.save(tracker)

            return res.status(200).json({
                'error_code': 0,
                message: 'Update successfully',
                data: tracker
            });
        } else {
            return res.status(404).json({ message: "Document Tracking not found" });
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
        const trackerRepository = getRepository(DocumentTracking)
        const isCheck = await trackerRepository.findOneBy({ Id: id })

        if (isCheck) {
            console.log("Delete loading")
            trackerRepository.softDelete(id)

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
            const trackerRepository = getRepository(DocumentTracking)
            const items = await trackerRepository
                .createQueryBuilder("document_tracking")
                .select()
                .where("document_tracking.deletedAt is null")
                .andWhere("document_tracking.createdAt >= :formatStartDay ", { formatStartDay })
                .andWhere("document_tracking.createdAt <= :formatEndDay ", { formatEndDay })
                .orderBy("document_tracking.Id", "DESC")
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
                { header: 'SỐ CÔNG VĂN', key: 'DispatchID', width: 10, color: 'blue' },
                { header: 'NGÀY BAN HÀNH', key: 'ReleaseDate', width: 30 },
                { header: 'TRÍCH YẾU', key: 'Subject', width: 10 },
                { header: 'NƠI NHẬN', key: 'Recipients', width: 30 },
                { header: 'NGƯỜI KÝ', key: 'Signer', width: 30 }
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    DispatchID: item.DispatchID,
                    ReleaseDate: item.ReleaseDate,
                    Subject: item.Subject,
                    Recipients: item.Recipients,
                    Signer: item.Signer
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const trackerRepository = getRepository(DocumentTracking)
            const items = await trackerRepository
                .createQueryBuilder("document_tracking")
                .select()
                .where("document_tracking.deletedAt is null")
                .orderBy("document_tracking.Id", "DESC")
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
                { header: 'SỐ CÔNG VĂN', key: 'DispatchID', width: 10, color: 'blue' },
                { header: 'NGÀY BAN HÀNH', key: 'ReleaseDate', width: 30 },
                { header: 'TRÍCH YẾU', key: 'Subject', width: 10 },
                { header: 'NƠI NHẬN', key: 'Recipients', width: 30 },
                { header: 'NGƯỜI KÝ', key: 'Signer', width: 30 }
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    DispatchID: item.DispatchID,
                    ReleaseDate: item.ReleaseDate,
                    Subject: item.Subject,
                    Recipients: item.Recipients,
                    Signer: item.Signer
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

