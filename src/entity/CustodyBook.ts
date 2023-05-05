import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class CustodyBook {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    PayDay: Date;

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
    ViolatorName: String;

    @Column({
        type: "varchar",
        length: 50
    })
    HaveDetained: String;

    @Column({
        type: "varchar",
        length: 100
    })
    PaidBack: String;

    @Column({
        type: "varchar",
        length: 100
    })
    StaffPay: String;

    @DeleteDateColumn()
    deletedAt?: Date;
}