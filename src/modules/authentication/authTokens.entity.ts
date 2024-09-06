import {Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserAccountEntity} from "../userAccount/userAccount.entity";


interface auth_tokens{
    id: number,
    user_id: UserAccountEntity,
    uuid: string,
    refresh_token: string,
    access_token: string,
    refresh_expires_at: Date,
    access_expires_at: Date,
}

@Entity({name : "auth_tokens"})

export class AuthTokensEntity implements auth_tokens{

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(()=> UserAccountEntity, {onDelete: "CASCADE"})
    @JoinColumn({name: "user_id"})
    user_id: UserAccountEntity

    @Column({comment: "this column holds the device id for the user"})
    @Generated("uuid")
    uuid: string

    @Column({type: "varchar", length: 500,  nullable: false})
    refresh_token: string

    @Column({type: "varchar", length: 500,  nullable: false})
    access_token: string

    @Column({type: "datetime"})
    refresh_expires_at: Date

    @Column({type: "datetime"})
    access_expires_at: Date
}
