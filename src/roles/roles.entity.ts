import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import {UserProfile} from "../userProfile/userProfile.entity";

interface role{
    id: number,
    name: string,
    userProfiles: UserProfile []
}

@Entity()

export class Roles implements role{

    @PrimaryGeneratedColumn()
    id: number

    @Column({length:50})
    name: string

    @OneToMany(()=> UserProfile, (userProfiles : UserProfile )=> userProfiles.role_id)
    userProfiles: UserProfile[]

}
