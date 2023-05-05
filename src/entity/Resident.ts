import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class Resident {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Date: Date;

    @Column({
        type: "varchar",
        length: 100
    })
    Address: string;

    @Column({
        type: "varchar",
        length: 200
    })
    Host: String;

    @Column({
        type: "varchar",
        length: 50
    })
    FullName: String;

    @Column()
    CitizenNumber: number;

    @Column({
        type: "varchar",
        length: 100
    })
    Violationer: String;

    @Column({
        type: "varchar",
        length: 100
    })
    FormProcessing: string;

    @Column({
        type: "varchar",
        length: 100
    })
    PoliceCheck: String;

    @DeleteDateColumn()
    deletedAt?: Date;

    @Column()
    createdAt: Date
}