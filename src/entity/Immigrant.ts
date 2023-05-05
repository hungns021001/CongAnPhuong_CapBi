import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn
} from "typeorm";

@Entity()
export class Immigrant {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    RegisterDate: Date;
    @Column({
        type: "varchar",
        length: 255
    })
    FullName: string;

    @Column()
    BirthDay: Date;

    @Column({
        type: "varchar",
        length: 255
    })
    Gender: string;

    @Column({
        type: "varchar",
        length: 255
    })
    Country: string;

    @Column({
        type: "varchar",
        length: 255
    })
    ResidentialAddress: string;

    @Column({
        type: "varchar",
        length: 255
    })
    Passport: string;

    @Column({
        type: "varchar",
        length: 255
    })
    RecidencePermitNumber: string;

    @Column({
        type: "varchar",
        length: 255
    })
    Job: string;

    @Column()
    EntryDate: Date;

    @Column({
        type: "varchar",
        length: 255
    })
    GateEntry: string;

    @Column({
        type: "varchar",
        length: 255
    })
    EntryPurpose: string;

    @Column()
    SojournDateFrom: Date;

    @Column()
    SojournDateTo: Date;

    @Column({
        type: "varchar",
        length: 255
    })
    GuarantorName: string;

    @Column({
        type: "varchar",
        length: 255
    })
    FullNamePolice: string;

    @Column({
        type: "varchar",
        length: 255
    })
    PoliceLead: string;

    @DeleteDateColumn()
    deletedAt?: Date;

    @Column()
    createdAt: Date;
}