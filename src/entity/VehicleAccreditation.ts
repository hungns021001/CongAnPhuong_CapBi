import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class VehicleAccreditation {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    DateSend: Date;

    @Column({
        type: "varchar",
        length: 100
    })
    LicensePlates: string;

    @Column({
        type: "varchar",
        length: 200
    })
    Violation: String;

    @Column({
        type: "varchar",
        length: 50
    })
    Receiver: String;

    @Column()
    FinePaymentDate: Date;

    @Column({
        type: "varchar",
        length: 100
    })
    Images: String;

    @Column()
    DateOfViolation: Date;

    @Column({
        type: "varchar",
        length: 100
    })
    Location: String;

    @Column({
        type: "varchar",
        length: 100
    })
    OfficersStickFines: String;

    @Column({
        type: "varchar",
        length: 100
    })
    HandlingOfficer: String;

    @DeleteDateColumn()
    deletedAt?: Date;
}