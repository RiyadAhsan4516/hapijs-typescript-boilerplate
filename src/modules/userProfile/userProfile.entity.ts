import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import {User} from "../userAccount/userAccount.entity";
import {Roles} from "../roles/roles.entity";

interface user_profile{
    id: number,
    name: string,
    address: string,
    phone_number: string,
    profile_photo: string,
    role_id: Roles,
    user_id: User
}

@Entity({name: "user_profile"})

export class UserProfile implements user_profile{

    @PrimaryGeneratedColumn()
    id : number;

    @Column({length: 50})
    name: string;

    @Column({length: 100})
    address: string;

    @Column({length: 100, unique: true})
    phone_number: string;

    @Column({length: 100})
    profile_photo: string;

    @ManyToOne(()=>Roles, (role: Roles)  => role.userProfiles)
    @JoinColumn({name: "role_id"})
    role_id: Roles;

    @OneToOne(()=>User, (user : User)=>user.user_profile_id, {onDelete: "CASCADE"})
    @JoinColumn({name:"user_id", referencedColumnName: "id"})
    user_id : User;
}
