import { NextFunction, Request, Response } from "express";
import { SanctioningDecisions } from "../../entity/SanctioningDecisions";
import { getRepository } from "typeorm";
import { checkDay, formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const moment = require('moment');
const Excel = require('exceljs');

export const createSanctionsHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {        
        const role_id = (req as any).auth.payload.role;
        const { decisionId,
            fullName,
            birthday,
            staying,
            nation,
            country,
            job,
            content,
            punisher,
            processingForm,
            fullnamePolice} = req.body;
        const imageUrl = (req.files as Express.Multer.File[])?.map(file => file['path'].replace('tmp\\uploads\\sanctions\\', 'https://capbi.onrender.com/sanctions/')) ?? [];
        console.log(imageUrl);   
        const date = new Date();
        const someDate = moment(date).format("YYYY-MM-DD HH:mm:ss");                    
        const sanctionsRepository = getRepository(SanctioningDecisions);
        let sanctions = new SanctioningDecisions();
        sanctions.DecisionId = decisionId;
        sanctions.FullName = fullName;
        sanctions.Birthday = formatDay(birthday) || null;
        sanctions.Staying = staying;
        sanctions.Nation = nation;
        sanctions.Country = country;
        sanctions.Job = job;
        sanctions.Content = content;
        sanctions.Punisher = punisher;
        sanctions.ProcessingForm = processingForm;
        sanctions.FullNamePolice = fullnamePolice;
        sanctions.RoleId = role_id;
        const imagesString = `[ ${imageUrl.map(path => `'${path}'`).join(', ')} ]`;
        sanctions.Images = imagesString || "default.png";
        sanctions.created_at = someDate;
        await sanctionsRepository.save(sanctions);

        return res.status(200).json({
            'error_code': 0,
            'msg': 'Created successfully',
            data: sanctions
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({
            msg: "Get internal server error",
        });
    }
};

export const getSanctions = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const role_id = (req as any).auth.payload.role;
        const sanctionsRepository = getRepository(SanctioningDecisions)
        const _list = await sanctionsRepository
        .createQueryBuilder("sanctioning_decisions")
        .select()
        .where("sanctioning_decisions.RoleId = :RoleId", { RoleId: role_id })
        .andWhere("sanctioning_decisions.deletedAt is null")
        .orderBy("sanctioning_decisions.Id", "DESC")
        .getMany()

        const page = Number(req.query.page) || 1
        const list_data = paginationHandle(page, _list)
        if (_list.length === 0) {
            return res.status(200).json({
                'error_code': 4,
                'msg': 'Data Not Found',
                 data: {
                    'list_data': []} 
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
        console.error("create-shift: ", err);
        res.status(500).send({
            msg: "Get internal server error in create shift handler",
        });
    }
};

export const getSanctionsByName = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { decisionId,
            fullName,
            birthday,
            staying,
            nation,
            country,
            job,
            content,
            punisher,
            processingForm,
            fullnamePolice } = req.body;
        const role_id = (req as any).auth.payload.role;
        const sanctionsRepository = getRepository(SanctioningDecisions)
        const search = await sanctionsRepository
        .createQueryBuilder("sanctioning_decisions")
        .select()

        if(decisionId)
            search.where("sanctioning_decisions.DecisionId ILIKE :decisionId", {decisionId: `%${decisionId}%`})
            .andWhere("sanctioning_decisions.RoleId = :roleid", {roleid : role_id})
            .andWhere("sanctioning_decisions.deletedAt is null")
        if(fullName)
            search.where("sanctioning_decisions.FullName ILIKE :fullName",{fullName: `%${fullName}%`})
            .andWhere("sanctioning_decisions.RoleId = :roleid", {roleid : role_id})
            .andWhere("sanctioning_decisions.deletedAt is null")
        if(birthday)
            search.where("sanctioning_decisions.Birthday =:birthday",{birthday: `${formatDay(birthday)}`})
            .andWhere("sanctioning_decisions.RoleId = :roleid", {roleid : role_id})
            .andWhere("sanctioning_decisions.deletedAt is null")
        if(staying)
            search.where("sanctioning_decisions.Staying ILIKE :staying",{staying: `%${staying}%`})
            .andWhere("sanctioning_decisions.RoleId = :roleid", {roleid : role_id})
            .andWhere("sanctioning_decisions.deletedAt is null")
        if(nation)
            search.where("sanctioning_decisions.Nation ILIKE :nation",{nation: `%${nation}%`})
            .andWhere("sanctioning_decisions.RoleId = :roleid", {roleid : role_id})
            .andWhere("sanctioning_decisions.deletedAt is null")
        if(country)
            search.where("sanctioning_decisions.Country ILIKE :country",{country: `%${country}%`})
            .andWhere("sanctioning_decisions.RoleId = :roleid", {roleid : role_id})
            .andWhere("sanctioning_decisions.deletedAt is null")
        if(job)
            search.where("sanctioning_decisions.Job ILIKE :job",{job: `%${job}%`})
            .andWhere("sanctioning_decisions.RoleId = :roleid", {roleid : role_id})
            .andWhere("sanctioning_decisions.deletedAt is null")
        if(content)
            search.where("sanctioning_decisions.Content ILIKE :content",{content: `%${content}%`})
            .andWhere("sanctioning_decisions.RoleId = :roleid", {roleid : role_id})
            .andWhere("sanctioning_decisions.deletedAt is null")
        if(punisher)
            search.where("sanctioning_decisions.Punisher ILIKE :punisher",{punisher: `%${punisher}%`})
            .andWhere("sanctioning_decisions.RoleId = :roleid", {roleid : role_id})
            .andWhere("sanctioning_decisions.deletedAt is null")
        if(processingForm)
            search.where("sanctioning_decisions.ProcessingForm ILIKE :processingForm",{processingForm: `%${processingForm}%`})
            .andWhere("sanctioning_decisions.RoleId = :roleid", {roleid : role_id})
            .andWhere("sanctioning_decisions.deletedAt is null")
        if(fullnamePolice)
            search.where("sanctioning_decisions.FullNamePolice ILIKE :fullnamePolice",{fullnamePolice: `%${fullnamePolice}%`})
            .andWhere("sanctioning_decisions.RoleId = :roleid", {roleid : role_id})
            .andWhere("sanctioning_decisions.deletedAt is null")

        const _data = await search
        .orderBy("sanctioning_decisions.Id", "ASC")
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
                'msg': 'Sanctions not found',
            })
        }    
    } catch (err: any) {
        console.error("create-shift: ", err);
        res.status(500).send({
            msg: "Get internal server error in create shift handler",
        });
    }
};

export const updateSanctionsHandle = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const sanctionsRepository = getRepository(SanctioningDecisions);
        const imageUrl = (req.files as Express.Multer.File[])?.map(file => file['path'].replace('tmp\\uploads\\sanctions\\', 'https://capbi.onrender.com/sanctions/')) ?? [];
        const imagesString = `[ ${imageUrl.map(path => `'${path}'`).join(', ')} ]`;
        const role_id = (req as any).auth.payload.role;
        const id = Number(req.params.id);
        const { decisionId,
            fullName,
            birthday,
            staying,
            nation,
            country,
            job,
            content,
            punisher,
            processingForm,
            fullnamePolice } = req.body;
       
        const sanctions = await sanctionsRepository
            .createQueryBuilder("sanctioning_decisions")
            .select()
            .where("sanctioning_decisions.RoleId = :roleid", { roleid: role_id })
            .andWhere("sanctioning_decisions.Id = :id", { id: id })
            .getOne()

        if (sanctions?.created_at === null) {
            return res.status(400).json({
                'error_code': 7,
                message: 'Editing error',
            });
        };
        
        if (checkDay(sanctions?.created_at) === true && (role_id != "6" || role_id != "1")) {
            return res.status(400).json({
                'error_code': 2,
                message: 'Editing time has passed.',
            });
        }

        if (sanctions) {
            sanctions.DecisionId = decisionId;
            sanctions.FullName = fullName;
            sanctions.Birthday = formatDay(birthday);
            sanctions.Staying = staying;
            sanctions.Nation = nation;
            sanctions.Country = country;
            sanctions.Job = job;             
            sanctions.Content = content;
            sanctions.Punisher = punisher;
            sanctions.ProcessingForm = processingForm;
            sanctions.FullNamePolice = fullnamePolice;
            sanctions.RoleId = role_id;
            sanctions.Images = imagesString || sanctions.Images;
           await sanctionsRepository.save(sanctions)

            return res.status(200).json({
                'error_code': 0,
                message: 'Update successfully',
                data: sanctions
            });
        } else {
            return res.status(404).json({ message: "Sanctions not found" });
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
        const sanctionsRepository = getRepository(SanctioningDecisions)
        const isCheck = await sanctionsRepository
        .createQueryBuilder("sanctioning_decisions")
        .select()
        .where("sanctioning_decisions.RoleId = :RoleId", {RoleId : role_id})
        .andWhere("sanctioning_decisions.Id = :id", {id : id})
        .getOne()

        if (isCheck) {
            console.log("Delete loading")
            sanctionsRepository.softDelete(id)

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
        const role_id = (req as any).auth.payload.role;
        const { startDay, endDay } = req.query
        if (startDay && endDay) {
            const formatStartDay = formatDay(startDay)
            const formatEndDay = formatDay(endDay)
            const sanctionsRepository = getRepository(SanctioningDecisions)
            const items = await sanctionsRepository
                .createQueryBuilder("sanctioning_decisions")
                .select()
                .where("sanctioning_decisions.RoleId = :RoleId", { RoleId: role_id })
                .andWhere("sanctioning_decisions.deletedAt is null")
                .andWhere("sanctioning_decisions.created_at >= :formatStartDay ", { formatStartDay })
                .andWhere("sanctioning_decisions.created_at <= :formatEndDay ", { formatEndDay })
                .orderBy("sanctioning_decisions.Id", "DESC")
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
                { header: 'STT', key: 'Id', width: 10 },
                { header: 'SỐ QUYẾT ĐỊNH', key: 'DecisionId', width: 10, color: 'blue' },
                { header: 'HỌ VÀ TÊN', key: 'FullName', width: 30 },
                { header: 'NĂM SINH', key: 'Birthday', width: 10 },
                { header: 'HỘ KHẨU, THƯỜNG TRÚ/ TẠM TRÚ', key: 'Staying', width: 30 },
                { header: 'DÂN TỘC', key: 'Nation', width: 30 },
                { header: 'QUỐC TỊCH', key: 'Country', width: 15 },
                { header: 'NGHỀ NGHIỆP, NƠI LÀM VIỆC', key: 'Job', width: 15 },
                { header: 'NỘI DUNG VI PHẠM', key: 'Content', width: 50 },
                { header: 'NGƯỜI RA QUYẾT ĐỊNH XỬ PHẠT', key: 'Punisher', width: 30 },
                { header: 'HÌNH THỨC XỬ LÝ', key: 'ProcessingForm', width: 30 },
                { header: 'CÁN BỘ ĐƯỢC PHÂN CÔNG XỬ LÝ', key: 'FullNamePolice', width: 30 },
                { header: 'HÌNH ẢNH', key: 'Images', width: 30 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id:startNumber,
                    DecisionId: item.DecisionId,
                    FullName: item.FullName,
                    Birthday: item.Birthday,
                    Staying: item.Staying,
                    Nation: item.Nation,
                    Country: item.Country,
                    Job: item.Job,
                    Content: item.Content,
                    Punisher: item.Punisher,
                    ProcessingForm: item.ProcessingForm,
                    FullNamePolice: item.FullNamePolice,
                    Images: item.Images,
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const sanctionsRepository = getRepository(SanctioningDecisions)
            const items = await sanctionsRepository
                .createQueryBuilder("sanctioning_decisions")
                .select()
                .where("sanctioning_decisions.RoleId = :RoleId", { RoleId: role_id })
                .andWhere("sanctioning_decisions.deletedAt is null")
                .orderBy("sanctioning_decisions.Id", "DESC")
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
                { header: 'STT', key: 'Id', width: 10 },
                { header: 'SỐ QUYẾT ĐỊNH', key: 'DecisionId', width: 10, style: {color : 'blue'} },
                { header: 'HỌ VÀ TÊN', key: 'FullName', width: 30 },
                { header: 'NĂM SINH', key: 'Birthday', width: 10 },
                { header: 'HỘ KHẨU, THƯỜNG TRÚ TẠM TRÚ', key: 'Staying', width: 30 },
                { header: 'DÂN TỘC', key: 'Nation', width: 30 },
                { header: 'QUỐC TỊCH', key: 'Country', width: 15 },
                { header: 'NGHỀ NGHIỆP, NƠI LÀM VIỆC', key: 'Job', width: 15 },
                { header: 'NỘI DUNG VI PHẠM', key: 'Content', width: 50 },
                { header: 'NGƯỜI RA QUYẾT ĐỊNH XỬ PHẠT', key: 'Punisher', width: 30 },
                { header: 'HÌNH THỨC XỬ LÝ', key: 'ProcessingForm', width: 30 },
                { header: 'CÁN BỘ ĐƯỢC PHÂN CÔNG XỬ LÝ', key: 'FullNamePolice', width: 30 },
                { header: 'HÌNH ẢNH', key: 'Images', width: 30 },
            ];
            let startNumber = 1;
            items.forEach(item => {
                worksheet.addRow({
                    Id: startNumber,
                    DecisionId: item.DecisionId,
                    FullName: item.FullName,
                    Birthday: item.Birthday,
                    Staying: item.Staying,
                    Nation: item.Nation,
                    Country: item.Country,
                    Job: item.Job,
                    Content: item.Content,
                    Punisher: item.Punisher,
                    ProcessingForm: item.ProcessingForm,
                    FullNamePolice: item.FullNamePolice,
                    Images: item.Images,
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

}