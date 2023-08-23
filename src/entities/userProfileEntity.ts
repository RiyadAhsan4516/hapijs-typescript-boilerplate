import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { User } from "./userEntity";
import { Roles } from "./roleEntity";

interface user_profile{
    id: number,
    name: string,
    address: string,
    phone_number: string,
    profile_photo: string,
    role: Roles,
    user_id: User
}

@Entity()

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

    @ManyToOne(()=>Roles, role => role.userProfiles)
    role: Roles;

    @OneToOne(()=>User, (user : User)=>user.user_profile_id)
    @JoinColumn({name:"user_id", referencedColumnName: "id"})
    user_id : User;
}
