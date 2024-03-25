import {Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn} from "typeorm";
import {UserProfile} from "../userProfile/userProfile.entity";
import {Roles} from "../roles/roles.entity";

interface user{
    id: number,
    email: string,
    password: string
    user_profile_id: UserProfile,
    role_id : Roles,
    account_creation_date : Date,
    modified_at: Date
}

@Entity({name: "user"})

export class User implements user {

    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 100, unique: true})
    email: string

    @Column({length:100, select: false})
    password: string

    @OneToOne(()=>UserProfile, (user_profile_id : UserProfile)=> user_profile_id.user_id)
    user_profile_id : UserProfile

    @ManyToOne(()=> Roles, (role_id : Roles)=> role_id.user_id)
    @JoinColumn({name: "role_id"})
    role_id : Roles

    @Column({type: "datetime"})
    account_creation_date : Date

    @Column({type: "datetime", default: () : string=> "CURRENT_TIMESTAMP"})
    modified_at : Date

}
