import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

interface notification{
    id: number,
    notification: string,
    read_status: number
}

@Entity({name: "notification"})
export class Notification implements notification{

    @PrimaryGeneratedColumn()
    id: number

    @Column({length:100})
    notification: string

    @Column({default: 0})
    read_status : number

}
