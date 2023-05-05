import { NextFunction, Request, Response } from "express";
import { formatDay, paginationHandle, totalPage } from "../../libs/common/pagination";
import { HandlingTrackingOnDay } from "../../entity/HandlingTrackingOnDay";
import { getRepository } from "typeorm";
import { moveToCustody, moveToNotProcessed, moveToSanction, moveToVehicle } from "../../libs/common/migrate";
const Excel = require('exceljs');

export const createHandle = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { licensePlates,
      dateOfViolation,
      addressOfViolation,
      violation,
      fullName,
      custody,
      handoverUnit,
      receiver,
      amount,
      result } = req.body;
    const imageUrl = (req.files as Express.Multer.File[])?.map(file => file['path'].replace('tmp\\uploads\\handlingonday\\', 'https://capbi.onrender.com/handlingonday/')) ?? [];
    const imagesString = `[ ${imageUrl.map(path => `'${path}'`).join(', ')} ]`;
    const dateOfViolationFomat = formatDay(dateOfViolation);
    const handlingOnDayRepo = getRepository(HandlingTrackingOnDay)
    let handlingOnDay = new HandlingTrackingOnDay()
    handlingOnDay.LicensePlates = licensePlates
    handlingOnDay.DateOfViolation = dateOfViolationFomat
    handlingOnDay.AddressOfViolation = addressOfViolation
    handlingOnDay.Violation = violation
    handlingOnDay.FullName = fullName
    handlingOnDay.Custody = custody
    handlingOnDay.HandoverUnit = handoverUnit
    handlingOnDay.Receiver = receiver
    handlingOnDay.Amount = amount
    handlingOnDay.Picture = imagesString || "default.png",
    handlingOnDay.Result = result
    handlingOnDay.Verify = 0
    handlingOnDayRepo.save(handlingOnDay)

    return res.status(200).json({
      error_code: 0,
      msg: "success",
    });
  } catch (err: any) {
    console.error("create-vehicle-accreditation: ", err);
    res.status(500).send({
      msg: "Get internal server error in create Vehicle Accreditation",
    });
  }
};

export const getHandling = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const handlingRepository = getRepository(HandlingTrackingOnDay)
    const _list = await handlingRepository
      .createQueryBuilder("handling_tracking_on_day")
      .select()
      .where("handling_tracking_on_day.deletedAt is null")
      .orderBy("handling_tracking_on_day.Id", "DESC")
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

export const getHandlingDayByName = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { licensePlates,
      dateOfViolation,
      addressOfViolation,
      violation,
      fullName,
      custody,
      handoverUnit,
      receiver,
      amount,
      result,
      verify } = req.body;
    const handlingRepository = getRepository(HandlingTrackingOnDay)
    const search = await handlingRepository
      .createQueryBuilder('handling_tracking_on_day')
      .select()

    if (dateOfViolation) {
      search.where("handling_tracking_on_day.DateOfViolation =:dateOfViolation", { dateOfViolation: `${formatDay(dateOfViolation)}` })
      .andWhere("handling_tracking_on_day.deletedAt is null")
    }
    if (licensePlates) {
      search.where("handling_tracking_on_day.LicensePlates ILIKE :licensePlates", { licensePlates: `%${licensePlates}%` })
      .andWhere("handling_tracking_on_day.deletedAt is null")
    }
    if (addressOfViolation) {
      search.where("handling_tracking_on_day.AddressOfViolation ILIKE :addressOfViolation", { addressOfViolation: `%${addressOfViolation}%` })
      .andWhere("handling_tracking_on_day.deletedAt is null")
    }
    if (violation) {
      search.where("handling_tracking_on_day.Violation ILIKE :violation", { violation: `%${violation}%` })
      .andWhere("handling_tracking_on_day.deletedAt is null")
    }
    if (fullName) {
      search.where("handling_tracking_on_day.FullName ILIKE :fullName", { fullName: `%${fullName}%` })
      .andWhere("handling_tracking_on_day.deletedAt is null")
    }
    if (custody) {
      search.where("handling_tracking_on_day.Custody ILIKE :custody", { custody: `%${custody}%` })
      .andWhere("handling_tracking_on_day.deletedAt is null")
    }
    if (handoverUnit) {
      search.where("handling_tracking_on_day.HandoverUnit ILIKE :handoverUnit", { handoverUnit: `%${handoverUnit}%` })
      .andWhere("handling_tracking_on_day.deletedAt is null")
    }
    if (receiver) {
      search.where("handling_tracking_on_day.Receiver ILIKE :receiver", { receiver: `%${receiver}%` })
      .andWhere("handling_tracking_on_day.deletedAt is null")
    }
    if (amount) {
      search.where("handling_tracking_on_day.Amount ILIKE :amount", { amount: `%${amount}%` })
      .andWhere("handling_tracking_on_day.deletedAt is null")
    }
    if (result) {
      search.where("handling_tracking_on_day.Result ILIKE :result", { result: `%${result}%` })
      .andWhere("handling_tracking_on_day.deletedAt is null")
    }
    if (verify) {
      search.where("handling_tracking_on_day.Verify =:verify", { verify: `${verify}` })
      .andWhere("handling_tracking_on_day.deletedAt is null")
    }

    const _data = await search
    .orderBy("handling_tracking_on_day.Id", "ASC")
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
    const id = Number(req.params.id)
    const { licensePlates,
      dateOfViolation,
      addressOfViolation,
      violation,
      fullName,
      custody,
      handoverUnit,
      receiver,
      amount,
      result } = req.body;
    const imageUrl = (req.files as Express.Multer.File[])?.map(file => file['path'].replace('tmp\\uploads\\handlingonday\\', 'https://capbi.onrender.com/handlingonday/')) ?? [];
    const imagesString = `[ ${imageUrl.map(path => `'${path}'`).join(', ')} ]`;
    const handlingOnDayRepository = getRepository(HandlingTrackingOnDay)
    const handlingOnDay = await handlingOnDayRepository.findOneBy({ Id: id })

    if (handlingOnDay) {
      if (handlingOnDay.Verify === 0) {
        handlingOnDay.LicensePlates = licensePlates;
        handlingOnDay.DateOfViolation = formatDay(dateOfViolation) || null;
        handlingOnDay.AddressOfViolation = addressOfViolation;
        handlingOnDay.Violation = violation;
        handlingOnDay.FullName = fullName;
        handlingOnDay.Custody = custody;
        handlingOnDay.HandoverUnit = handoverUnit;
        handlingOnDay.Receiver = receiver;
        handlingOnDay.Amount = amount;
        handlingOnDay.Picture = imagesString || handlingOnDay.Picture;
        handlingOnDay.Result = result;
        await handlingOnDayRepository.save(handlingOnDay)
        return res.status(200).json({
          'error_code': 0,
          message: 'Update successfully',
          data: handlingOnDay
        });
      }
      else {
        return res.status(500).send({
          msg: "Id verified before"
        })
      }
    } else {
      return res.status(404).json({ message: "ID not found" });
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
    const handlingOnDayRepository = getRepository(HandlingTrackingOnDay)
    const isCheck = await handlingOnDayRepository.findOneBy({ Id: id })

    if (isCheck) {
      if (isCheck.Verify === 0) {
        handlingOnDayRepository.softDelete(id)

        return res.status(200).json({
          'error_code': 0,
          'msg': 'Deleted successfully',
        });
      }
      else {
        return res.status(500).send({
          msg: "Id verified before"
        })
      }
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

export const verifyHandle = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const role_id = (req as any).auth.payload.role;
    const id = Number(req.params.id)
    const { done } = req.body//true
    const handlingRepository = getRepository(HandlingTrackingOnDay)
    const checkVerify = await handlingRepository.findOneBy({ Id: id })
    if (checkVerify?.Verify == 1) {
      return res.status(500).send({
        msg: "Id verified before"
      })
    }
    moveToVehicle(id, done)
    moveToSanction(id, role_id, done)
    moveToCustody(id)
    moveToNotProcessed(id)

    const verify = await handlingRepository.createQueryBuilder()
      .update(HandlingTrackingOnDay).set({ Verify: 1 })
      .where("Id =:id", { id: id })
      .execute()

    return res.status(200).json({
      error_code: 0,
      msg: "success",
    });
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
      const handlingRepository = getRepository(HandlingTrackingOnDay)
      const items = await handlingRepository
        .createQueryBuilder("handling_tracking_on_day")
        .select()
        .where("handling_tracking_on_day.deletedAt is null")
        .andWhere("handling_tracking_on_day.createdAt >= :formatStartDay ", { formatStartDay })
        .andWhere("handling_tracking_on_day.createdAt <= :formatEndDay ", { formatEndDay })
        .orderBy("handling_tracking_on_day.Id", "DESC")
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
        { header: 'BIỂN KIỂM SOÁT', key: 'LicensePlates', width: 30 },
        { header: 'NGÀY VI PHẠM', key: 'DateOfViolation', width: 10 },
        { header: 'ĐỊA ĐIỂM VI PHẠM', key: 'AddressOfViolation', width: 30 },
        { header: 'LỖI VI PHẠM', key: 'Violation', width: 30 },
        { header: 'TÊN NGƯỜI VI PHẠM', key: 'FullName', width: 15 },
        { header: 'TẠM GIỮ', key: 'Custody', width: 15 },
        { header: 'ĐƠN VỊ BÀN GIAO', key: 'HandoverUnit', width: 15 },
        { header: 'CÁN BỘ TIẾP NHẬN', key: 'Receiver', width: 15 },
        { header: 'TIỀN PHẠT', key: 'Amount', width: 15 },
        { header: 'HÌNH ẢNH ĐÍNH KÈM', key: 'Picture', width: 15 },
        { header: 'KẾT QUẢ XỬ LÝ', key: 'Result', width: 15 }

      ];
      let startNumber = 1;
      items.forEach(item => {
        worksheet.addRow({
          Id: startNumber,
          LicensePlates: item.LicensePlates,
          DispaDateOfViolationtchId: item.DateOfViolation,
          AddressOfViolation: item.AddressOfViolation,
          Violation: item.Violation,
          FullName: item.FullName,
          Custody: item.Custody,
          HandoverUnit: item.HandoverUnit,
          Receiver: item.Receiver,
          Amount: item.Amount,
          Picture: item.Picture,
          Result: item.Result
        });
        startNumber++
      });
      res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx")
      // Lưu workbook xuống tệp Excel
      await workbook.xlsx.write(res)
    } else {
      const handlingRepository = getRepository(HandlingTrackingOnDay)
      const items = await handlingRepository
        .createQueryBuilder("handling_tracking_on_day")
        .select()
        .where("handling_tracking_on_day.deletedAt is null")
        .orderBy("handling_tracking_on_day.Id", "DESC")
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
        { header: 'BIỂN KIỂM SOÁT', key: 'LicensePlates', width: 30 },
        { header: 'NGÀY VI PHẠM', key: 'DateOfViolation', width: 10 },
        { header: 'ĐỊA ĐIỂM VI PHẠM', key: 'AddressOfViolation', width: 30 },
        { header: 'LỖI VI PHẠM', key: 'Violation', width: 30 },
        { header: 'TÊN NGƯỜI VI PHẠM', key: 'FullName', width: 15 },
        { header: 'TẠM GIỮ', key: 'Custody', width: 15 },
        { header: 'ĐƠN VỊ BÀN GIAO', key: 'HandoverUnit', width: 15 },
        { header: 'CÁN BỘ TIẾP NHẬN', key: 'Receiver', width: 15 },
        { header: 'TIỀN PHẠT', key: 'Amount', width: 15 },
        { header: 'HÌNH ẢNH ĐÍNH KÈM', key: 'Picture', width: 15 },
        { header: 'KẾT QUẢ XỬ LÝ', key: 'Result', width: 15 }
      ];
      let startNumber = 1;
      items.forEach(item => {
        worksheet.addRow({
          Id: startNumber,
          LicensePlates: item.LicensePlates,
          DispaDateOfViolationtchId: item.DateOfViolation,
          AddressOfViolation: item.AddressOfViolation,
          Violation: item.Violation,
          FullName: item.FullName,
          Custody: item.Custody,
          HandoverUnit: item.HandoverUnit,
          Receiver: item.Receiver,
          Amount: item.Amount,
          Picture: item.Picture,
          Result: item.Result
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