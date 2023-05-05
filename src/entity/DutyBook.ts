import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class DutyBook {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Date: Date;

    @Column({
        type: "varchar",
        length: 100
    })
    HourOnDuty: string;

    @Column({
        type: "varchar",
        length: 100
    })
    FullName: string;

    @Column()
    Total: Number;

    @Column()
    Present: Number;

    @Column()
    ExcusedAbsence: Number;

    @Column()
    AbsenceNoReason: Number;

    @Column({
        type: "varchar",
        length: 100
    })
    ContentOfShift: string;

    @Column({
        type: "varchar",
        length: 100
    })
    InformationOfShift: string;

    @Column({
        type: "varchar",
        length: 100
    })
    DirectiveInformation: string;

    @Column({
        type: "varchar",
        length: 100
    })
    FullNameHandover: string;

    @Column({
        type: "varchar",
        length: 100
    })
    FullNameReceiver: string;

    @Column({
        type: "varchar",
        length: 100
    })
    LeadShift: string;

    @DeleteDateColumn()
    deletedAt?: Date;
}