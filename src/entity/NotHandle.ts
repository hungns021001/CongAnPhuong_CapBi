import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn
} from "typeorm";

@Entity()
export class NotHandle {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    DateOfViolation: Date;

    @Column({
        type: "varchar",
        length: 255
    })
    Violation: string;

    @Column({
        type: "varchar",
        length: 255
    })
    LocationViolation: string;

    @DeleteDateColumn()
    deletedAt?: Date;

    @Column()
    createdAt?: Date;

    @Column({
        type: "varchar",
        length: 255
    })
    LisencePlate: string;

    @Column({
        type: "varchar",
        length: 255
    })
    NameViolator: string;

    @Column({
        type: "varchar",
        length: 255
    })
    NameBailsman: string;

    @Column({
        type: "varchar",
        length: 255
    })
    SolCommander: string;

    @Column({
        type: "varchar",
        length: 255
    })
    StaffReceive: string;
}