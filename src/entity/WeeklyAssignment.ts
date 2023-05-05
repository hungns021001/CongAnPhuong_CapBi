import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class WeeklyAssignment {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({
        type: "varchar",
        length: 100
    })
    Days: string;

    @Column()
    Date: Date;

    @Column({
        type: "varchar",
        length: 50
    })
    Captain: String;

    @Column(
        {
            type: "varchar",
            length: 50
        }
    )
    InHour: String;

    @Column({
        type: "varchar",
        length: 100
    })
    OverTime: String;

    @Column({
        type: "varchar",
        length: 100
    })
    OnDuty: String;

    @Column({
        type: "varchar",
        length: 100
    })
    PatrolShiftOne: String;

    @Column({
        type: "varchar",
        length: 100
    })
    PatrolShiftTwo: String;

    @Column()
    created_at: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}