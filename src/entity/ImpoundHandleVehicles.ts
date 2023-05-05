import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn
} from "typeorm";

@Entity()
export class ImpoundHandleVehicles {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    ReturnDate: Date;

    @Column({
        type: "varchar",
        length: 255
    })
    LicensePlates: string;

    @Column()
    DateOfViolation: Date;

    @Column({
        type: "varchar",
        length: 255
    })
    FullName: string;

    @Column({
        type: "varchar",
        length: 255
    })
    OnHold: string;

    @Column(
        {
            type: "varchar",
            length: 255
        }
    )
    Returned: String;

    @Column({
        type: "varchar",
        length: 255
    })
    OfficerReturns: String;

    @Column()
    RoleId?: Number;

    @Column()
    created_at?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}