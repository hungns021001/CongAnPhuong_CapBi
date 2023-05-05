import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class SanctioningDecisions {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({
        type: "varchar",
        length: 50
    })
    DecisionId: String;

    @Column({
        type: "varchar",
        length: 100
    })
    FullName: String;

    @Column()
    Birthday: Date;

    @Column({
        type: "varchar",
        length: 200
    })
    Staying: String;

    @Column({
        type: "varchar",
        length: 50
    })
    Nation: String;

    @Column({
        type: "varchar",
        length: 50
    })
    Country: string;

    @Column({
        type: "varchar",
        length: 100
    })
    Job: string;

    @Column({
        type: "varchar",
        length: 200
    })
    Content: String;

    @Column({
        type: "varchar",
        length: 100
    })
    Punisher: string;

    @Column({
        type: "varchar",
        length: 100
    })
    ProcessingForm: string;

    @Column({
        type: "varchar",
        length: 100
    })
    FullNamePolice: string;

    @Column()
    RoleId: Number;

    @Column({
        type: "varchar",
        length: 100
    })
    Images: String;

    @Column()
    created_at: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}