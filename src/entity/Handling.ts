import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
    CreateDateColumn
} from "typeorm";

@Entity()
export class HandlingViolations {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    DateViolation: Date;

    @Column({
        type: "varchar",
        length: 100
    })
    AddressViolation: String;

    @Column({
        type: "varchar",
        length: 100
    })
    NameOfViolation: String;

    @Column({
        type: "varchar",
        length: 100
    })
    Content: String;

    @Column({
        type: "varchar",
        length: 100
    })
    DirectiveInformation: String;

    @Column({
        type: "varchar",
        length: 100
    })
    FullNamePolice: string;

    @Column({
        type: "varchar",
        length: 100
    })
    Result: string;

    @Column({
        type: "varchar",
        length: 100
    })
    Images: string;

    @CreateDateColumn()
    created_at?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}