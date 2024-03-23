import {Column, Entity, PrimaryGeneratedColumn, OneToOne} from "typeorm";
import {UserProfile} from "../userProfile/userProfile.entity";

interface user{
    id: number,
    email: string,
    password: string
    user_profile_id: UserProfile
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

}
