import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user" })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", length: 150, unique: true })
    email: string;

    @Column({ type: "varchar", length: 100, select: false })
    password: string;

    @Column({ type: "varchar", length: 100 })
    fullname: string;

    @Column({ type: "bool", default: true })
    isActive: boolean;

    @Column('varchar', {
        array: true,
        default: ['user']
    })
    roles: string[];

}
