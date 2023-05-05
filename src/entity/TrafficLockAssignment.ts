import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn
} from "typeorm";

@Entity()
export class TrafficLockAssignment {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Date: Date;

    @Column({
        type: "varchar",
        length: 255
    })
    Days: String

    @Column()
    TrafficIntersection: String;

    @Column()
    Morning: String;

    @Column()
    Afternoon: String;

    @Column({
        type: "varchar",
        length: 255
    })
    Note: String

    @Column()
    created_at: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}