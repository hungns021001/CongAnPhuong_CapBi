import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn
} from "typeorm";

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({
        type: "varchar",
        length: 255
    })
    Username: string;

    @Column({
        type: "varchar",
        length: 255
    })
    Password: string;

    @Column({
        type: "varchar",
        length: 255
    })
    RoleId: string;

    @Column({
        type: "varchar",
        length: 255
    })
    FullName: string;

    @DeleteDateColumn()
    deletedAt?: Date;
}