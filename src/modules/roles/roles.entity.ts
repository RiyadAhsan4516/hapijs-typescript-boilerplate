import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../userAccount/userAccount.entity";

interface role{
    id: number,
    name: string,
    user_id: User []
}

@Entity()

export class Roles implements role{

    @PrimaryGeneratedColumn()
    id: number

    @Column({length:50})
    name: string

    @OneToMany(()=> User, (user_id : User )=> user_id.role_id)
    user_id: User[]

}
