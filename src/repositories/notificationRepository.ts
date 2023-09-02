import {Repository, UpdateResult} from "typeorm";
import { Notification } from "../entities/notificationEntity";
import { AppDataSource } from "../data-source";
import {Service} from "typedi";
import {Boom} from "@hapi/boom";

@Service()
export class NotificationRepository{

    private notifyRepo : Repository<Notification>

    constructor(){
        this.notifyRepo = AppDataSource.getRepository(Notification)
    }

    async getNotifications() : Promise<any>{
        try{
            return await this.notifyRepo.createQueryBuilder("notification")
                .where('notification.read_status = :value', { value: 0 })
                .getMany();
        }catch(err){
            console.log(err);
            throw new Boom("getNotification query failed", {statusCode: 500})
        }
    }

    async createNotification(input: object) : Promise<any>{

        try{
            let notification = await this.notifyRepo.createQueryBuilder()
                .insert()
                .into(Notification)
                .values(input)
                .execute()

            return notification.raw
        }catch(err){
            throw new Boom("could not create a new notification", {statusCode: 500})
        }
    }

    async updateReadStatus(read_status: number, id: number): Promise<any>{
        try{
            let newInputs : {read_status: number} = {read_status}
            let notification : UpdateResult = await this.notifyRepo.createQueryBuilder()
                .update(Notification)
                .set(newInputs)
                .where('id = :id',{id})
                .execute()

            return true;
        }catch(err){
            console.log(err)
            throw new Boom("updateReadStatus failed", {statusCode: 500})
        }

    }

}
