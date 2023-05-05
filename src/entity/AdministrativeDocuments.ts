import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class AdministrativeDocuments {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Date: Date;

    @Column({
        type: "varchar",
        length: 100
    })
    DispatchId: string;

    @Column()
    ReleaseDate: Date;

    @Column({
        type: "varchar",
        length: 200
    })
    AgencyIssued: String;

    @Column({
        type: "varchar",
        length: 50
    })
    FullName: String;

    @Column()
    SettlementTime: Date;

    @Column()
    Result: number;

    @Column()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}