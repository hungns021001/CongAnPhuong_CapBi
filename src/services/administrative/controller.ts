import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { getRepository } from "typeorm";
import { AdministrativeDocuments } from "../../entity/AdministrativeDocuments";
import { formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const Excel = require('exceljs');

export const createAdministrativeHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {

        const { date,
            dispatchId,
            releaseDate,
            agencyIssued,
            fullName,
            settlementTime,
            result
            } = req.body;
        const datecreate = new Date();
        const someDate = moment(datecreate).format("YYYY-MM-DD HH:mm:ss");   
        const administrativeRepository = getRepository(AdministrativeDocuments)
        let administrative = new AdministrativeDocuments()
        administrative.Date = formatDay(date),
        administrative.DispatchId = dispatchId,
        administrative.ReleaseDate = formatDay(releaseDate),
        administrative.AgencyIssued = agencyIssued,
        administrative.FullName = fullName,
        administrative.SettlementTime = formatDay(settlementTime),
        administrative.Result = Number(result),

        administrativeRepository.save(administrative);
        
        return res.json({
            'error_code': 0,
            'msg': 'success',
             data: administrative
        });        
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error in create administrative documents handler",
        });
    }
};

export const getAdministrative = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const administrativeRepository = getRepository(AdministrativeDocuments)
        const _list = await administrativeRepository
        .createQueryBuilder("administrative_documents")
        .select()
        .orderBy("administrative_documents.Id","DESC")
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
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};

export const getAdministrativeByReceiver = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { date,
            dispatchId,
            releaseDate,
            agencyIssued,
            fullName,
            settlementTime,
            result
            } = req.body;
        const AdministrativeRepository = getRepository(AdministrativeDocuments)
        const search = await AdministrativeRepository
                    .createQueryBuilder('administrative_documents')
                    .select()
        
        if (date) {
            search.where("administrative_documents.Date =:date", {date: `${formatDay(date)}`})
        }
        if (dispatchId) {
            search.where("administrative_documents.DispatchId ILIKE :dispatchId", {dispatchId: `%${dispatchId}%`})
        }
        if (releaseDate) {
            search.where("administrative_documents.ReleaseDate =:releaseDate", {releaseDate: `${formatDay(releaseDate)}`})
        }
        if (fullName) {
            search.where("administrative_documents.FullName ILIKE :fullName", {fullName: `%${fullName}%`})
        }
        if (agencyIssued) {
            search.where("administrative_documents.AgencyIssued ILIKE :agencyIssued", {agencyIssued: `%${agencyIssued}%`})
        }
        if(settlementTime) {
            search.where("administrative_documents.SettlementTime =:settlementTime", { settlementTime: `${formatDay(settlementTime)}` })
        }
        if (result) {
            search.where("administrative_documents.Result =:result", {result: `${result}`})
        }
                    
        const _data = await search.orderBy("administrative_documents.Id","ASC")
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
                'msg': 'ID Administrative Documents not found',
            })
        }
    } catch (err: any) {
        console.error("get_Administrative_by_id: ", err);
        res.status(500).send({
            msg: "Get internal server error in get immigrant by id",
        });
    }
};

export const updateAdministrativeHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const administrativeRepository = getRepository(AdministrativeDocuments)
        const id = Number(req.params.id)
        const { date,
            dispatchId,
            releaseDate,
            agencyIssued,
            fullName,
            settlementTime,
            result
            } = req.body;

        const administrative = await administrativeRepository.findOneBy({Id: id})

        if (administrative) {
            administrative.Date = formatDay(date),
            administrative.DispatchId = dispatchId,
            administrative.ReleaseDate = formatDay(releaseDate),
            administrative.AgencyIssued = agencyIssued,
            administrative.FullName = fullName,
            administrative.SettlementTime = formatDay(settlementTime),
            administrative.Result = Number(result),

            administrativeRepository.save(administrative)

            return res.status(200).json({
                'error_code': 0,
                 message: 'Update successfully',
                 data: administrative
            });
        } else {
            return res.status(404).json({ message: "Administrative Book not found" });
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
        const administrativeRepository = getRepository(AdministrativeDocuments)
        const isCheck = await administrativeRepository.findOneBy({Id:  id })

        if (isCheck) {
            administrativeRepository.softDelete(id)

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
            const administrativeRepository = getRepository(AdministrativeDocuments)
            const items = await administrativeRepository
                .createQueryBuilder("administrative_documents")
                .select()
                .where("administrative_documents.deletedAt is null")
                .andWhere("administrative_documents.createdAt >= :formatStartDay ", { formatStartDay })
                .andWhere("administrative_documents.createdAt <= :formatEndDay ", { formatEndDay })
                .orderBy("administrative_documents.Id", "DESC")
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
                { header: 'NGÀY NHẬN VĂN BẢN', key: 'Date', width: 30 },
                { header: 'SỐ VĂN BẢN', key: 'DispatchId', width: 10 },
                { header: 'NGÀY BAN HÀNH', key: 'ReleaseDate', width: 30 },
                { header: 'CƠ QUAN BAN HÀNH', key: 'AgencyIssued', width: 30 },
                { header: 'CÁN BỘ GIẢI QUYẾT', key: 'SettlementTime', width: 15 },
                { header: 'ĐÁNH GIÁ KẾT QUẢ', key: 'Result', width: 15 },
                
            ];
            let startNumber = 1;
            let result = "";
            items.forEach(item => {
                if(item.Result === 1){
                    result = "Hoàn thành";
                }else{
                    result = "Chưa hoàn thành";
                }
                worksheet.addRow({
                    Id: startNumber,
                    Date: item.Date,
                    DispatchId: item.DispatchId,
                    ReleaseDate: item.ReleaseDate,
                    AgencyIssued: item.AgencyIssued,
                    SettlementTime: item.SettlementTime,
                    Result: result
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const administrativeRepository = getRepository(AdministrativeDocuments)
            const items = await administrativeRepository
                .createQueryBuilder("administrative_documents")
                .select()
                .where("administrative_documents.deletedAt is null")
                .orderBy("administrative_documents.Id", "DESC")
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
                { header: 'NGÀY NHẬN VĂN BẢN', key: 'Date', width: 30 },
                { header: 'SỐ VĂN BẢN', key: 'DispatchId', width: 10 },
                { header: 'NGÀY BAN HÀNH', key: 'ReleaseDate', width: 30 },
                { header: 'CƠ QUAN BAN HÀNH', key: 'AgencyIssued', width: 30 },
                { header: 'CÁN BỘ GIẢI QUYẾT', key: 'SettlementTime', width: 15 },
                { header: 'ĐÁNH GIÁ KẾT QUẢ', key: 'Result', width: 15 },
            ];
            let startNumber = 1;
            let result = "";
            items.forEach(item => {
                if(item.Result === 1){
                    result = "Hoàn thành";
                }else{
                    result = "Chưa hoàn thành";
                }
                worksheet.addRow({
                    Id: startNumber,
                    Date: item.Date,
                    DispatchId: item.DispatchId,
                    ReleaseDate: item.ReleaseDate,
                    AgencyIssued: item.AgencyIssued,
                    SettlementTime: item.SettlementTime,
                    Result: result
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