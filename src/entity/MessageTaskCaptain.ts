import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class MessageTaskCaptain {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    IdAdmin: number;

    @Column({
        type:"varchar",
        length:255
    })
    message: string;

    @Column()
    link_task: string;

    @Column()
    datetime: string;

    @DeleteDateColumn()
    deletedAt?: Date;

}