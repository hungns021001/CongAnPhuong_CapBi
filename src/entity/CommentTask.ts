import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn
} from "typeorm";

@Entity()
export class CommentTask {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    idTask: number;

    @Column()
    idUser: number;

    @Column({ 
        type: "varchar",
        length: 255
    })
    comment: string;

    @Column({ 
        type: "varchar",
        length: 255
    })
    time: string;

    @Column()
    fullName: string;

    @DeleteDateColumn()
    deletedAt?: Date;

}