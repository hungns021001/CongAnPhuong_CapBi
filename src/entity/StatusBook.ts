import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn
} from "typeorm";

@Entity()
export class StatusBook {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    DateTime: Date;

    @Column({
        type: "varchar",
        length: 255
    })
    PersonOnDuty: string;

    @Column({
        type: "varchar",
        length: 255
    })
    Details: string;

    @Column({
        type: "varchar",
        length: 255
    })
    Handler: string;

    @Column({
        type: "varchar",
        length: 255
    })
    Note: string;

    @DeleteDateColumn()
    deletedAt?: Date;
}