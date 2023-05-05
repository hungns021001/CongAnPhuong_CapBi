import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class MessageTaskPolice {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    IdUser: number;

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