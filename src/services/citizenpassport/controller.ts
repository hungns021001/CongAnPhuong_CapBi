import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { CitizenPassport } from "../../entity/CitizenPassport";
import { formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const Excel = require('exceljs');

export const createPassportHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { fullName,
            birthday,
            gender,
            staying,
            confirmationDate,
            fullNamePolice,
            leaderSign } = req.body;

        const passportRepository = getRepository(CitizenPassport)
        let passport = new CitizenPassport()
        passport.FullName = fullName;
        passport.Birthday = formatDay(birthday);
        passport.Gender = gender;
        passport.Staying = staying;
        passport.ConfirmationDate = formatDay(confirmationDate);
        passport.FullNamePolice = fullNamePolice;
        passport.LeaderSign = leaderSign;

        passportRepository.save(passport);
            
        return res.json({
            'error_code': 0,
            'msg': 'success',
             data: passport
        });
    } catch (err: any) {
        console.error("create-passport: ", err);
        res.status(500).send({
            msg: "Get internal server error in create passport handler",
        });
    }
};

export const getPassport = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const passportRepository = getRepository(CitizenPassport)
        const _list = await passportRepository
        .createQueryBuilder("citizen_passport")
        .select()
        .orderBy("citizen_passport.Id", "DESC")
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
        console.error("get-passport: ", err);
        res.status(500).send({
            msg: "Get internal server error in get passport",
        });
    }
};

export const getPassportByName = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {fullName, birthday,staying, confirmationDate, fullNamePolice, leaderSign, gender} = req.body
        const passportRepository = getRepository(CitizenPassport)
        const search = await passportRepository
        .createQueryBuilder('citizen_passport')
        .select()

        if(fullName)
        {
            search.where("citizen_passport.FullName ILIKE :fullName",{fullName: `%${fullName}%`})
        }
        if(birthday)
        {
            search.where("citizen_passport.Birthday =:birthday",{birthday: `${formatDay(birthday)}`})
        }
        if(staying)
        {
            search.where("citizen_passport.Staying ILIKE :staying",{staying: `%${staying}%`})
        }
        if(confirmationDate)
        {
            search.where("citizen_passport.ConfirmationDate =:confirmationDate",{confirmationDate: `%${formatDay(confirmationDate)}%`})
        }
        if(fullNamePolice)
        {
            search.where("citizen_passport.FullNamePolice ILIKE :fullNamePolice",{fullNamePolice: `%${fullNamePolice}%`})
        }
        if(leaderSign)
        {
            search.where("citizen_passport.LeaderSign ILIKE :leaderSign",{leaderSign: `%${leaderSign}%`})
        }
        if(gender)
        {
            search.where("citizen_passport.Gender =:gender",{gender: `${gender}`})
        }

        const _data = await search.orderBy("citizen_passport.Id", "ASC")
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
                'msg': 'Citizen Passport not found',
            })
        }
    } catch (err: any) {
        console.error("get passport by name: ", err);
        res.status(500).send({
            msg: "Get internal server error in get passport",
        });
    }
};

export const updatePassportHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const passportRepository = getRepository(CitizenPassport)
        const passpordId = Number(req.params.id)
        const { fullName,
            birthday,
            gender,
            staying,
            confirmationDate,
            fullNamePolice,
            leaderSign } = req.body;

        const passport = await passportRepository.findOneBy({Id: passpordId})

        if (passport) {
            passport.FullName = fullName;
            passport.Birthday = formatDay(birthday);
            passport.Gender = gender;
            passport.Staying = staying;
            passport.ConfirmationDate = formatDay(confirmationDate);
            passport.FullNamePolice = fullNamePolice;
            passport.LeaderSign = leaderSign;

            passportRepository.save(passport)

            return res.status(200).json({
                'error_code': 0,
                 message: 'Update successfully',
                 data: passport
            });
        } else {
            return res.status(404).json({ message: "Passport not found" });
        }
       
    } catch (err: any) {
        console.error("update passport: ", err);
        res.status(500).send({
            msg: "Get internal server error in update passport",
        });
    }
};

export const destroyHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const passportRepository = getRepository(CitizenPassport);
        const isCheck = await passportRepository.findOneBy({Id:  id })

        if (isCheck) {
            passportRepository.softDelete(id)

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
            const passportRepository = getRepository(CitizenPassport)
            const items = await passportRepository
                .createQueryBuilder("citizen_passport")
                .select()
                .where("citizen_passport.deletedAt is null")
                .andWhere("citizen_passport.createdAt >= :formatStartDay ", { formatStartDay })
                .andWhere("citizen_passport.createdAt <= :formatEndDay ", { formatEndDay })
                .orderBy("citizen_passport.Id", "DESC")
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
                { header: 'HỌ VÀ TÊN', key: 'FullName', width: 30 },
                { header: 'NGÀY SINH', key: 'Birthday', width: 10 },
                { header: 'GIỚI TÍNH', key: 'Gender', width: 30 },
                { header: 'HỘ KHẨU THƯỜNG TRÚ', key: 'Staying', width: 30 },
                { header: 'NGÀY XÁC NHẬN', key: 'ConfirmationDate', width: 15 },
                { header: 'CÁN BỘ KIỂM TRA', key: 'FullNamePolice', width: 15 },
                { header: 'LÃNH ĐẠO KÝ', key: 'LeaderSign', width: 15 }
  
            ];
            let startNumber = 1;
            items.forEach(item => {
                let gender = "";
                if(item.Gender == 1){
                    gender = "Nam"
                }else{
                    gender = "Nữ"
                }
                worksheet.addRow({
                    Id: startNumber,
                    FullName: item.FullName,
                    Birthday: item.Birthday,
                    Gender: gender,
                    Staying: item.Staying,
                    ConfirmationDate: item.ConfirmationDate,
                    FullNamePolice: item.FullNamePolice,
                    LeaderSign: item.LeaderSign
                });
                startNumber++
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const passportRepository = getRepository(CitizenPassport)
            const items = await passportRepository
                .createQueryBuilder("citizen_passport")
                .select()
                .where("citizen_passport.deletedAt is null")
                .orderBy("citizen_passport.Id", "DESC")
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
                { header: 'HỌ VÀ TÊN', key: 'FullName', width: 30 },
                { header: 'NGÀY SINH', key: 'Birthday', width: 10 },
                { header: 'GIỚI TÍNH', key: 'Gender', width: 30 },
                { header: 'HỘ KHẨU THƯỜNG TRÚ', key: 'Staying', width: 30 },
                { header: 'NGÀY XÁC NHẬN', key: 'ConfirmationDate', width: 15 },
                { header: 'CÁN BỘ KIỂM TRA', key: 'FullNamePolice', width: 15 },
                { header: 'LÃNH ĐẠO KÝ', key: 'LeaderSign', width: 15 }
            ];
            let startNumber =1;
            items.forEach(item => {
                let gender = "";
                if(item.Gender == 1){
                    gender = "Nam"
                }else{
                    gender = "Nữ"
                }
                worksheet.addRow({
                    Id: startNumber,
                    FullName: item.FullName,
                    Birthday: item.Birthday,
                    Gender: gender,
                    Staying: item.Staying,
                    ConfirmationDate: item.ConfirmationDate,
                    FullNamePolice: item.FullNamePolice,
                    LeaderSign: item.LeaderSign
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
