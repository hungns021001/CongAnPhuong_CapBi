import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Immigrant } from "../../entity/Immigrant";
import { formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
const Excel = require('exceljs');


export const createImmigrantHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {
            RegisterDate,
            FullName,
            BirthDay,
            Gender,
            Country,
            ResidentialAddress,
            Passport,
            RecidencePermitNumber,
            Job,
            EntryDate,
            GateEntry,
            EntryPurpose,
            SojournDateFrom,
            SojournDateTo,
            GuarantorName,
            FullNamePolice,
            PoliceLead
        } = req.body;

        const immigrantRepository = getRepository(Immigrant)
        let immigrant = new Immigrant();
        immigrant.RegisterDate = formatDay(RegisterDate)
        immigrant.FullName = formatDay(FullName)
        immigrant.BirthDay = formatDay(BirthDay)
        immigrant.Gender = Gender
        immigrant.Country = Country
        immigrant.ResidentialAddress = ResidentialAddress
        immigrant.Passport = Passport
        immigrant.RecidencePermitNumber = RecidencePermitNumber
        immigrant.Job = Job
        immigrant.EntryDate = formatDay(EntryDate)
        immigrant.GateEntry = GateEntry
        immigrant.EntryPurpose = EntryPurpose
        immigrant.SojournDateFrom = formatDay(SojournDateFrom)
        immigrant.SojournDateTo = formatDay(SojournDateTo)
        immigrant.GuarantorName = GuarantorName
        immigrant.FullNamePolice = FullNamePolice
        immigrant.PoliceLead = PoliceLead

        immigrantRepository.save(immigrant);

        return res.json({
            'error_code': 0,
            'msg': 'success',
            data: immigrant
        });
    } catch (err: any) {
        console.error("create-immigrant-handler: ", err);
        res.status(500).send({
            msg: "Get internal server error in create immigrant handler",
        });
    }
};

export const getImmigrant = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const immigrantRepository = getRepository(Immigrant)
        const _list = await immigrantRepository
            .createQueryBuilder("immigrant")
            .select()
            .orderBy("immigrant", "DESC")
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
        console.error("get-immigrant: ", err);
        res.status(500).send({
            msg: "Get internal server error in get immigrant",
        });
    }
};

export const getImmigrantByName = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const {
            RegisterDate,
            FullName,
            BirthDay,
            Gender,
            Country,
            ResidentialAddress,
            Passport,
            RecidencePermitNumber,
            Job,
            EntryDate,
            GateEntry,
            EntryPurpose,
            SojournDateFrom,
            SojournDateTo,
            GuarantorName,
            FullNamePolice,
            PoliceLead
        } = req.body;
        const immigrantRepository = getRepository(Immigrant)
        const search = await immigrantRepository
            .createQueryBuilder('immigrant')
            .select()

        if (RegisterDate)
            search.where("immigrant.RegisterDate =:RegisterDate", { RegisterDate: `${formatDay(RegisterDate)}` })
        if (FullName)
            search.where("immigrant.FullName ILIKE :FullName", { FullName: `%${FullName}%` })
        if (BirthDay)
            search.where("immigrant.BirthDay =:BirthDay", { BirthDay: `${formatDay(BirthDay)}` })
        if (Gender)
            search.where("immigrant.Gender ILIKE :Gender", { Gender: `%${Gender}%` })
        if (Country)
            search.where("immigrant.Country ILIKE :Country", { Country: `%${Country}%` })
        if (ResidentialAddress)
            search.where("immigrant.ResidentialAddress ILIKE :ResidentialAddress", { ResidentialAddress: `%${ResidentialAddress}%` })
        if (Passport)
            search.where("immigrant.Passport ILIKE :Passport", { Passport: `%${Passport}%` })
        if (RecidencePermitNumber)
            search.where("immigrant.RecidencePermitNumber ILIKE :RecidencePermitNumber", { RecidencePermitNumber: `%${RecidencePermitNumber}%` })
        if (Job)
            search.where("immigrant.Job ILIKE :Job", { Job: `%${Job}%` })
        if (EntryDate)
            search.where("immigrant.EntryDate =:EntryDate", { EntryDate: `${formatDay(EntryDate)}` })
        if (GateEntry)
            search.where("immigrant.GateEntry ILIKE :GateEntry", { GateEntry: `%${GateEntry}%` })
        if (EntryPurpose)
            search.where("immigrant.EntryPurpose ILIKE :EntryPurpose", { EntryPurpose: `%${EntryPurpose}%` })
        if (SojournDateFrom)
            search.where("immigrant.SojournDateFrom =:SojournDateFrom", { SojournDateFrom: `${formatDay(SojournDateFrom)}` })
        if (SojournDateTo)
            search.where("immigrant.SojournDateTo =:SojournDateTo", { SojournDateTo: `${formatDay(SojournDateTo)}` })
        if (GuarantorName)
            search.where("immigrant.GuarantorName ILIKE :GuarantorName", { GuarantorName: `%${GuarantorName}%` })
        if (FullNamePolice)
            search.where("immigrant.FullNamePolice ILIKE :FullNamePolice", { FullNamePolice: `%${FullNamePolice}%` })
        if (PoliceLead)
            search.where("immigrant.PoliceLead ILIKE :PoliceLead", { PoliceLead: `%${PoliceLead}%` })

        const _data = await search.orderBy("immigrant", "ASC")
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
                'msg': 'Immigrant not found',
            })
        }
    } catch (err: any) {
        console.error("get_immigrant_by_id: ", err);
        res.status(500).send({
            msg: "Get internal server error in get immigrant by id",
        });
    }
};

export const updateImmigrantHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const immigrantRepository = getRepository(Immigrant)
        const immigrantId = Number(req.params.id)
        const {
            RegisterDate,
            FullName,
            BirthDay,
            Gender,
            Country,
            ResidentialAddress,
            Passport,
            RecidencePermitNumber,
            Job,
            EntryDate,
            GateEntry,
            EntryPurpose,
            SojournDateFrom,
            SojournDateTo,
            GuarantorName,
            FullNamePolice,
            PoliceLead
        } = req.body;

        const immigrant = await immigrantRepository.findOneBy({ Id: immigrantId })

        if (immigrant) {
            immigrant.RegisterDate = formatDay(RegisterDate)
            immigrant.FullName = FullName
            immigrant.BirthDay = formatDay(BirthDay)
            immigrant.Gender = Gender
            immigrant.Country = Country
            immigrant.ResidentialAddress = ResidentialAddress
            immigrant.Passport = Passport
            immigrant.RecidencePermitNumber = RecidencePermitNumber
            immigrant.Job = Job
            immigrant.EntryDate = formatDay(EntryDate)
            immigrant.GateEntry = GateEntry
            immigrant.EntryPurpose = EntryPurpose
            immigrant.SojournDateFrom = formatDay(SojournDateFrom)
            immigrant.SojournDateTo = formatDay(SojournDateTo)
            immigrant.GuarantorName = GuarantorName
            immigrant.FullNamePolice = FullNamePolice
            immigrant.PoliceLead = PoliceLead

            immigrantRepository.save(immigrant)

            return res.status(200).json({
                'error_code': 0,
                message: 'Update successfully',
                data: immigrant
            });
        } else {
            return res.status(404).json({ message: "immigrant not found" });
        }

    } catch (err: any) {
        console.error("create-shift: ", err);
        res.status(500).send({
            msg: "Get internal server error in update immigrant handler",
        });
    }
};

export const destroyHandler = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id)
        const immigrantRepository = getRepository(Immigrant)
        const isCheck = await immigrantRepository.findOneBy({ Id: id })

        if (isCheck) {
            console.log("Delete loading")
            immigrantRepository.softDelete(id)

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
            msg: "Get internal server error in create immigrant handler",
        });
    }
};
export const exportToExcel = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { startDay, endDay } = req.query
        if (startDay && endDay) {
            const formatStartDay = formatDay(startDay)
            const formatEndDay = formatDay(endDay)
            const immigrantRepository = getRepository(Immigrant)
            const items = await immigrantRepository
                .createQueryBuilder("immigrant")
                .select()
                .where("immigrant.deletedAt is null")
                .andWhere("immigrant.createdAt >= :formatStartDay ", { formatStartDay })
                .andWhere("immigrant.createdAt <= :formatEndDay ", { formatEndDay })
                .orderBy("immigrant.Id", "DESC")
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
                { header: 'NGÀY ĐĂNG KÝ', key: 'RegisterDate', width: 30 },
                { header: 'HỌ VÀ TÊN', key: 'FullName', width: 10 },
                { header: 'NGÀY SINH', key: 'BirthDay', width: 30 },
                { header: 'GIỚI TÍNH', key: 'Gender', width: 30 },
                { header: 'QUỐC TỊCH', key: 'Country', width: 30 },
                { header: 'ĐỊA CHỈ CƯ TRÚ', key: 'ResidentialAddress', width: 15 },
                { header: 'SỔ HỘ CHIẾU', key: 'Passport', width: 15 },
                { header: 'SỐ GIẤY TỜ CHO CƯ TRÚ', key: 'RecidencePermitNumber', width: 15 },
                { header: 'NGHỀ NGHIỆP', key: 'Job', width: 15 },
                { header: 'NGÀY NHẬP CẢNH', key: 'EntryDate', width: 15 },
                { header: 'CỬA KHẨU NHẬP CẢNH', key: 'GateEntry', width: 15 },
                { header: 'MỤC ĐÍCH NHẬP CẢNH', key: 'EntryPurpose', width: 15 },
                { header: 'NGÀY BẮT ĐẦU TẠM TRÚ', key: 'SojournDateFrom', width: 15 },
                { header: 'NGÀY ĐI', key: 'SojournDateTo', width: 15 },
                { header: 'HỌ TÊN CHỦ NHÀ', key: 'GuarantorName', width: 15 },
                { header: 'CÁN BỘ ĐĂNG KÝ', key: 'FullNamePolice', width: 15 },
                { header: 'CHỈ HUY KÝ', key: 'PoliceLead', width: 15 }
            ];
            let startNumber = 1;
            items.forEach(item => {
                let gender = "";
                if(item.Gender == "1"){
                    gender = "Nam";
                }else{
                    gender = "Nữ"
                }
                worksheet.addRow({
                    Id: startNumber,
                    RegisterDate: item.RegisterDate,
                    FullName: item.FullName,
                    BirthDay: item.BirthDay,
                    Gender: gender,
                    Country: item.Country,
                    ResidentialAddress: item.ResidentialAddress,
                    Passport: item.Passport,
                    RecidencePermitNumber: item.RecidencePermitNumber,
                    Job: item.Job,
                    EntryDate: item.EntryDate,
                    GateEntry: item.GateEntry,
                    EntryPurpose: item.EntryPurpose,
                    SojournDateFrom: item.SojournDateFrom,
                    SojournDateTo: item.SojournDateTo,
                    GuarantorName: item.GuarantorName,
                    FullNamePolice: item.FullNamePolice,
                    PoliceLead: item.PoliceLead
                });
                startNumber++;
            });
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
            // Lưu workbook xuống tệp Excel
            await workbook.xlsx.write(res)
        } else {
            const immigrantRepository = getRepository(Immigrant)
            const items = await immigrantRepository
                .createQueryBuilder("immigrant")
                .select()
                .where("immigrant.deletedAt is null")
                .orderBy("immigrant.Id", "DESC")
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
                { header: 'NGÀY ĐĂNG KÝ', key: 'RegisterDate', width: 30 },
                { header: 'HỌ VÀ TÊN', key: 'FullName', width: 10 },
                { header: 'NGÀY SINH', key: 'BirthDay', width: 30 },
                { header: 'GIỚI TÍNH', key: 'Gender', width: 30 },
                { header: 'QUỐC TỊCH', key: 'Country', width: 30 },
                { header: 'ĐỊA CHỈ CƯ TRÚ', key: 'ResidentialAddress', width: 15 },
                { header: 'SỔ HỘ CHIẾU', key: 'Passport', width: 15 },
                { header: 'SỐ GIẤY TỜ CHO CƯ TRÚ', key: 'RecidencePermitNumber', width: 15 },
                { header: 'NGHỀ NGHIỆP', key: 'Job', width: 15 },
                { header: 'NGÀY NHẬP CẢNH', key: 'EntryDate', width: 15 },
                { header: 'CỬA KHẨU NHẬP CẢNH', key: 'GateEntry', width: 15 },
                { header: 'MỤC ĐÍCH NHẬP CẢNH', key: 'EntryPurpose', width: 15 },
                { header: 'NGÀY BẮT ĐẦU TẠM TRÚ', key: 'SojournDateFrom', width: 15 },
                { header: 'NGÀY ĐI', key: 'SojournDateTo', width: 15 },
                { header: 'HỌ TÊN CHỦ NHÀ', key: 'GuarantorName', width: 15 },
                { header: 'CÁN BỘ ĐĂNG KÝ', key: 'FullNamePolice', width: 15 },
                { header: 'CHỈ HUY KÝ', key: 'PoliceLead', width: 15 },
            ];
            let startNumber =1;
            items.forEach(item => {
                let gender = "";
                if(item.Gender == "1"){
                    gender = "Nam";
                }else{
                    gender = "Nữ"
                }
                worksheet.addRow({
                    Id: startNumber,
                    RegisterDate: item.RegisterDate,
                    FullName: item.FullName,
                    BirthDay: item.BirthDay,
                    Gender: gender,
                    Country: item.Country,
                    ResidentialAddress: item.ResidentialAddress,
                    Passport: item.Passport,
                    RecidencePermitNumber: item.RecidencePermitNumber,
                    Job: item.Job,
                    EntryDate: item.EntryDate,
                    GateEntry: item.GateEntry,
                    EntryPurpose: item.EntryPurpose,
                    SojournDateFrom: item.SojournDateFrom,
                    SojournDateTo: item.SojournDateTo,
                    GuarantorName: item.GuarantorName,
                    FullNamePolice: item.FullNamePolice,
                    PoliceLead: item.PoliceLead
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