import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";

@Entity()
export class IdentityConfirmation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    Date: Date;

    @Column({
        type: "varchar",
        length: 100
    })
    FullName: string;

    @Column()
    Gender: number;

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
    GrantReason: String;

    @Column({
        type: "varchar",
        length: 50
    })
    Verifier: string;

    @Column({
        type: "varchar",
        length: 100
    })
    LeaderSign: string;

    @Column()
    deletedAt: Date;

    @Column()
    createdAt: Date;

}