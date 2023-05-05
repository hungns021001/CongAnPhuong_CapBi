import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn
} from "typeorm";

@Entity()
export class CitizenPassport {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({
        type: "varchar",
        length: 255
    })
    FullName: string;

    @Column()
    Birthday: Date;

    @Column()
    Gender: number;

    @Column({
        type: "varchar",
        length: 255
    })
    Staying: string;

    @Column()
    ConfirmationDate: Date;

    @Column({
        type: "varchar",
        length: 255
    })
    FullNamePolice: string;

    @Column({
        type: "varchar",
        length: 255
    })
    LeaderSign: string;

    @DeleteDateColumn()
    deletedAt?: Date;
}