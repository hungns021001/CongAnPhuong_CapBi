import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class DocumentTracking {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({
        type: "varchar",
        length: 100
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
        length: 50
    })
    Signer: String;

    @Column({
        type: "varchar",
        length: 200
    })
    Recipients: string;

    @Column()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}