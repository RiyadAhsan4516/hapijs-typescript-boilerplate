import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UserAccountEntity} from "../userAccount/userAccount.entity";

interface role{
    id: number,
    name: string,
    user_id: UserAccountEntity []
}

@Entity()

export class Roles implements role{

    @PrimaryGeneratedColumn()
    id: number

    @Column({length:50})
    name: string

    @OneToMany(()=> UserAccountEntity, (user_id : UserAccountEntity )=> user_id.role_id)
    user_id: UserAccountEntity[]

}
