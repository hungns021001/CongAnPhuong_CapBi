import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class SituationOfDay {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Date: Date;

    @Column({
        type: "varchar",
        length: 100
    })
    ForceOnDuty: String;

    @Column({
        type: "varchar",
        length: 200
    })
    CaseName: String;

    @Column({
        type: "varchar",
        length: 50
    })
    Location: String;

    @Column({
        type: "varchar",
        length: 50
    })
    Content: string;

    @Column({
        type: "varchar",
        length: 100
    })
    Receive: string;

    @Column({
        type: "varchar",
        length: 200
    })
    Custody: String;

    @Column({
        type: "varchar",
        length: 100
    })
    Returns: string;

    @Column({
        type: "varchar",
        length: 100
    })
    HandOver: string;
    
    @Column()
    created_at: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @Column({
        type: "varchar",
        length: 100
    })
    PoliceHandle: string;
}