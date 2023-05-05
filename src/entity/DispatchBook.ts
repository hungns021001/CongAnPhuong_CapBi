import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class DispatchBook {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Datetime: Date;

    @Column({
        type: "varchar",
        length: 50
    })
    DispatchID: string;

    @Column()
    ReleaseDate: Date;

    @Column({
        type: "varchar",
        length: 200
    })
    Subject: String;

    @Column({
        type: "varchar",
        length: 200
    })
    AgencyIssued: String;

    @Column({
        type: "varchar",
        length: 50
    })
    Receiver: string;

    @DeleteDateColumn()
    deletedAt?: Date;
}