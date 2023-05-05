import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class WorkAssign {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({
        type: "varchar",
        length: 255
    })
    title: string;

    @Column({
        type: "varchar",
        length: 255
    })
    content: string;

    @Column()
    date: Date;

    @Column()
    active: Number;

    @Column()
    accountId: string;

    @Column()
    time: string;

    @Column()
    received: Number;

    @Column()
    jobneeds: Number;

    @Column()
    namePolice: string;

    @Column()
    nameAdmin: string;

    @DeleteDateColumn()
    deletedAt?: Date;

}