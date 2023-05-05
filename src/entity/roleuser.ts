import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn
} from "typeorm";

@Entity()
export class roleuser {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({
        type: "varchar",
        length: 255
    })
    Name: string;

    @DeleteDateColumn()
    deletedAt?: Date;
}