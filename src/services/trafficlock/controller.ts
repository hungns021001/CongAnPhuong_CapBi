import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { TrafficLockAssignment } from "../../entity/TrafficLockAssignment";
import { formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const moment = require("moment");
const Excel = require('exceljs');

export const createHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { days, date, trafficIntersection, morning, afternoon, note } = req.body
        const trafficLockRepo = getRepository(TrafficLockAssignment)
        const date_create = new Date();
        const someDate = moment(date_create).format("YYYY-MM-DD HH:mm:ss");
        let trafficLockHandle = new TrafficLockAssignment()
        trafficLockHandle.Days = days
        trafficLockHandle.Date = formatDay(date)
        trafficLockHandle.TrafficIntersection = JSON.stringify(trafficIntersection)
        trafficLockHandle.Morning = JSON.stringify(morning)
        trafficLockHandle.Afternoon = JSON.stringify(afternoon)
        trafficLockHandle.Note = note
        trafficLockHandle.created_at = someDate

        await trafficLockRepo.save(trafficLockHandle)
        return res.status(200).json({
            'error_code': 0,
            'msg': 'success',
            data: trafficLockHandle
        });

    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
}

export const getTrafficLock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const trafficLockRepo = getRepository(TrafficLockAssignment);
        const _list = await trafficLockRepo
            .createQueryBuilder("traffic_lock_assignment")
            .select()
            .orderBy("traffic_lock_assignment.Id", "DESC")
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
        console.error(err);
        res.status(500).send({
            msg: "Internal Server Error",
        });
    }
}

export const getSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { days, trafficIntersection, morning, afternoon } = req.body
        const trafficLockRepo = getRepository(TrafficLockAssignment)
        const search = await trafficLockRepo
                    .createQueryBuilder('traffic_lock_assignment')
                    .select()
        
        if (days) {
            search.where("traffic_lock_assignment.Days =:days", {days: `${formatDay(days)}`})
        }
        if (trafficIntersection) {
            search.where(`traffic_lock_assignment.TrafficIntersection ::text ILIKE :trafficIntersection`, {trafficIntersection: `%${trafficIntersection}%`} )
        }
        if (morning) {
            search.where(`traffic_lock_assignment.Morning ::text ILIKE :morning`, {morning: `%${morning}%`} )
        }
        if (afternoon) {
            search.where(`traffic_lock_assignment.Afternoon ::text ILIKE :afternoon`, {afternoon: `%${afternoon}%`} )
        }
                    
        const _data = await search.orderBy("traffic_lock_assignment.Id","ASC")
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
                'msg': 'ID  not found',
            })
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
        const trafficLockRepo = getRepository(TrafficLockAssignment)
        const id = Number(req.params.id)
        const { days, date, trafficIntersection, morning, afternoon, note } = req.body
        const trafficLockHandle = await trafficLockRepo.findOneBy({Id: id})
        console.log(JSON.stringify(trafficLockHandle));
        

        if (trafficLockHandle) {
            trafficLockHandle.Days = days
            trafficLockHandle.Date = formatDay(date)
            trafficLockHandle.TrafficIntersection = JSON.stringify(trafficIntersection)
            trafficLockHandle.Morning = JSON.stringify(morning)
            trafficLockHandle.Afternoon = JSON.stringify(afternoon)
            trafficLockHandle.Note = note
            

            trafficLockRepo.save(trafficLockHandle)

            return res.status(200).json({
                'error_code': 0,
                 message: 'Update successfully',
                 data: trafficLockHandle
            });
        } else {
            return res.status(404).json({ message: "Traffic Lock Assignment not found" });
        }
       
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error ",
        });
    }
}

export const destroyHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id)
        const trafficLockRepo = getRepository(TrafficLockAssignment)
        const isCheck = await trafficLockRepo.findOneBy({Id:  id })

        if (isCheck) {
            trafficLockRepo.softDelete(id)

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
            const trafficLockRepo = getRepository(TrafficLockAssignment)
            const items = await trafficLockRepo
                .createQueryBuilder("traffic_lock_assignment")
                .select()
                .where("traffic_lock_assignment.deletedAt is null")
                .andWhere("traffic_lock_assignment.created_at >= :formatStartDay ", { formatStartDay })
                .andWhere("traffic_lock_assignment.created_at <= :formatEndDay ", { formatEndDay })
                .orderBy("traffic_lock_assignment.Id", "DESC")
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
                { header: 'THỨ', key: 'Days', width: 10, color: 'blue' },
                { header: 'NGÀY THÁNG NĂM', key: 'Date', width: 30 },
                { header: 'NÚT GIAO THÔNG', key: 'TrafficIntersection', width: 10 },
                { header: 'BUỔI SÁNG', key: 'Morning', width: 30 },
                { header: 'BUỔI CHIỀU', key: 'Afternoon', width: 30 },
                { header: 'GHI CHÚ', key: 'Note', width: 15 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id:startNumber,
                    Days: item.Days,
                    Date: item.Date,
                    TrafficIntersection: item.TrafficIntersection,
                    Morning: item.Morning,
                    Afternoon: item.Afternoon,
                    Note: item.Note,
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const trafficLockRepo = getRepository(TrafficLockAssignment)
            const items = await trafficLockRepo
                .createQueryBuilder("traffic_lock_assignment")
                .select()
                .where("traffic_lock_assignment.deletedAt is null")
                .orderBy("traffic_lock_assignment.Id", "DESC")
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
                { header: 'THỨ', key: 'Days', width: 10, color: 'blue' },
                { header: 'NGÀY THÁNG NĂM', key: 'Date', width: 30 },
                { header: 'NÚT GIAO THÔNG', key: 'TrafficIntersection', width: 10 },
                { header: 'BUỔI SÁNG', key: 'Morning', width: 30 },
                { header: 'BUỔI CHIỀU', key: 'Afternoon', width: 30 },
                { header: 'GHI CHÚ', key: 'Note', width: 15 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id:startNumber,
                    Days: item.Days,
                    Date: item.Date,
                    TrafficIntersection: item.TrafficIntersection,
                    Morning: item.Morning,
                    Afternoon: item.Afternoon,
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
