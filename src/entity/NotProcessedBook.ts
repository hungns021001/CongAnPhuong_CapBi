import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class NotProcessedBook {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({
        type: "varchar",
        length: 100
    })
    LicensePlates: string;

    @Column()
    DateOfViolation: Date;

    @Column({
        type: "varchar",
        length: 50
    })
    AddressOfViolation: String;

    @Column({
        type: "varchar",
        length: 50
    })
    Violations: String;

    @Column({
        type: "varchar",
        length: 100
    })
    ViolatorName: String;

    @Column({
        type: "varchar",
        length: 100
    })
    ApplicantName: String;

    @Column({
        type: "varchar",
        length: 100
    })
    ResolveCommander: String;

    @Column({
        type: "varchar",
        length: 100
    })
    OfficersReceive: String;

    @DeleteDateColumn()
    deletedAt?: Date;
}