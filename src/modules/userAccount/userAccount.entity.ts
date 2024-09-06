import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Roles} from "../roles/roles.entity";

interface user_account{
    id: number,
    email: string,
    password: string,
    name: string,
    address: string,
    phone_number: string,
    password_reset_code: string,
    reset_code_expired_at: Date,
    role_id : Roles,
    account_creation_date : Date,
    modified_at: Date
}

@Entity({name: "user_account"})

export class UserAccountEntity implements user_account {

    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 100, unique: true})
    email: string

    @Column({length:100, select: false})
    password: string

    @Index()
    @Column({type: "varchar", length: 100, nullable: false})
    name: string

    @Column({type: "varchar", length: 100, nullable: false})
    address: string

    @Column({type: "varchar", length: 14, nullable: false, unique: true})
    phone_number: string

    @Column({type: "varchar", length: 6, nullable: true})
    password_reset_code: string

    @Column({type: "datetime", nullable: true})
    reset_code_expired_at : Date

    @ManyToOne(()=> Roles, (role_id : Roles)=> role_id.user_id)
    @JoinColumn({name: "role_id"})
    role_id : Roles

    @Column({type: "datetime"})
    account_creation_date : Date

    @Column({type: "datetime", default: () : string=> "CURRENT_TIMESTAMP"})
    modified_at : Date

}
