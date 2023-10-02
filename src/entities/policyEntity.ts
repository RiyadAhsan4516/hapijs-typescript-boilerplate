import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

interface policy{
    id: number,
    read_status: number
}

@Entity()

export class PolicyReadStatus implements policy{
    @PrimaryGeneratedColumn()
    id: number

    @Column({default: 0})
    read_status: number
}
