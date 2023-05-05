import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class CalendarProtectsEvents {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({
        type: "varchar",
        length: 100
    })
    Date: string;

    @Column({
        type: "varchar",
        length: 200
    })
    Location: String;

    @Column({
        type: "varchar",
        length: 50
    })
    Force: String;

    @Column(
        {
            type: "varchar",
            length: 50
        }
    )
    Mission: String;

    @Column({
        type: "varchar",
        length: 100
    })
    Note: String;

    @Column()
    created_at: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}