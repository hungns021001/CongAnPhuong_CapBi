import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class HandlingTrackingOnDay {
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
        length: 200
    })
    AddressOfViolation: String;

    @Column({
        type: "varchar",
        length: 50
    })
    Violation: String;

    @Column(
        {
            type: "varchar",
            length: 50
        }
    )
    FullName: String;

    @Column({
        type: "varchar",
        length: 100
    })
    Custody: String;

    @Column({
        type: "varchar",
        length: 100
    })
    HandoverUnit: String;


    @Column({
        type: "varchar",
        length: 100
    })
    Receiver: String;

    @Column({
        type: "varchar",
        length: 100
    })
    Amount: String;

    @Column({
        type: "varchar",
        length: 100
    })
    Picture: String;

    @Column({
        type: "varchar",
        length: 100
    })
    Result: String;

    @DeleteDateColumn()
    deletedAt?: Date;

    @Column()
    Verify: number;

    @Column()
    createdAt: Date;
}