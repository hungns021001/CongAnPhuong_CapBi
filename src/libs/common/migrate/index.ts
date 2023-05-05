import { getRepository } from "typeorm";
import { HandlingTrackingOnDay } from "../../../entity/HandlingTrackingOnDay";
import { VehicleAccreditation } from "../../../entity/VehicleAccreditation";
import { SanctioningDecisions } from "../../../entity/SanctioningDecisions";
import { CustodyBook } from "../../../entity/CustodyBook";
import { NotProcessedBook } from "../../../entity/NotProcessedBook";
const moment = require('moment');

export const moveToVehicle = async function (id, done) {
    const handlingOnDayRepo = getRepository(HandlingTrackingOnDay);
    const handlingOnDay = await handlingOnDayRepo.findOneBy({
        Id: id,
    });
    if (!done) {        
        const date = new Date();
        const someDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
        const accreditationRepository = getRepository(VehicleAccreditation);
        let accreditation = new VehicleAccreditation();
        accreditation.LicensePlates = handlingOnDay?.LicensePlates || ''; // field 2
        accreditation.DateOfViolation = handlingOnDay?.DateOfViolation || someDate; // field 3
        accreditation.Location = handlingOnDay?.AddressOfViolation || ''; // field 4
        accreditation.Violation = handlingOnDay?.Violation || '' // 5
        accreditation.Images = handlingOnDay?.Picture || 'default.png'

        return await accreditationRepository.save(accreditation);
    } else {        
        const date = new Date();
        const someDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
        const accreditationRepository = getRepository(VehicleAccreditation);
        let accreditation = new VehicleAccreditation();
        accreditation.LicensePlates = handlingOnDay?.LicensePlates || ''; // field 2
        accreditation.DateOfViolation = handlingOnDay?.DateOfViolation || someDate; // field 3
        accreditation.Location = handlingOnDay?.AddressOfViolation || ''; // field 4
        accreditation.Violation = handlingOnDay?.Violation || '' // 5

        return await accreditationRepository.save(accreditation);
    }

}

export const moveToSanction = async function (id, role_id, done) {

    if (done) {        
        const handlingOnDayRepo = getRepository(HandlingTrackingOnDay);
        const handlingOnDay = await handlingOnDayRepo.findOneBy({
            Id: id,
        });
        const date = new Date();
        const someDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
        let sanctionsRepository = getRepository(SanctioningDecisions)
        let sanctions = new SanctioningDecisions
        sanctions.FullName = handlingOnDay?.FullName || ''
        sanctions.Content = handlingOnDay?.Violation || ''
        sanctions.RoleId = 4
        sanctions.created_at = someDate
        sanctions.Images = handlingOnDay?.Picture || 'default.png'

        return await sanctionsRepository.save(sanctions);
    } else {        
        const handlingOnDayRepo = getRepository(HandlingTrackingOnDay);
        const handlingOnDay = await handlingOnDayRepo.findOneBy({
            Id: id,
        });
        const date = new Date();
        const someDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
        let sanctionsRepository = getRepository(SanctioningDecisions)
        let sanctions = new SanctioningDecisions
        sanctions.FullName = handlingOnDay?.FullName || ''
        sanctions.Content = handlingOnDay?.Violation || ''
        sanctions.RoleId = 4
        sanctions.created_at = someDate

        return await sanctionsRepository.save(sanctions);
    }

}

export const moveToCustody = async function (id) {
    const handlingOnDayRepo = getRepository(HandlingTrackingOnDay);
    const handlingOnDay = await handlingOnDayRepo.findOneBy({
        Id: id
    })
    const date = new Date();
    const someDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
    let custodyRepo = getRepository(CustodyBook)
    let custody = new CustodyBook
    custody.LicensePlates = handlingOnDay?.LicensePlates || ''
    custody.DateOfViolation = handlingOnDay?.DateOfViolation || someDate
    custody.ViolatorName = handlingOnDay?.FullName || ''
    custody.HaveDetained = handlingOnDay?.Custody || ''

    return await custodyRepo.save(custody)
}

export const moveToNotProcessed = async function (id) {
    const handlingOnDayRepo = getRepository(HandlingTrackingOnDay);
    const handlingOnDay = await handlingOnDayRepo.findOneBy({
        Id: id
    })
    const date = new Date();
    const someDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
    let notProcessedRepo = getRepository(NotProcessedBook)
    let notProcessed = new NotProcessedBook()
    notProcessed.LicensePlates = handlingOnDay?.LicensePlates || ''
    notProcessed.DateOfViolation = handlingOnDay?.DateOfViolation || someDate
    notProcessed.AddressOfViolation = handlingOnDay?.AddressOfViolation || ''
    notProcessed.Violations = handlingOnDay?.Violation || ''
    notProcessed.ViolatorName = handlingOnDay?.FullName || ''

    return await notProcessedRepo.save(notProcessed)
}