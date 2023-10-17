import {Repository, UpdateResult} from "typeorm";
import { Notification } from "../entities/notificationEntity";
import { AppDataSource } from "../data-source";
import {Service} from "typedi";
import * as Boom from "@hapi/boom"

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
            throw Boom.badData("getNotification query failed")
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
            throw Boom.badData("could not create a new notification")
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
            throw Boom.badData("updateReadStatus failed")
        }

    }

}
