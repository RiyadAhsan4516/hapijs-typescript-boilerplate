import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../userAccount/userAccount.entity";

interface user_profile{
    id: number,
    name: string,
    address: string,
    phone_number: string,
    profile_photo: string,
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

    @OneToOne(()=>User, (user : User)=>user.user_profile_id, {onDelete: "CASCADE"})
    @JoinColumn({name:"user_id", referencedColumnName: "id"})
    user_id : User;
}
