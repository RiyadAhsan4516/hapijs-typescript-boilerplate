import {Inject, Service} from "typedi";
import {NotificationRepository} from "./notification.repository";
import {Notification} from "./notification.entity";
import {badRequest} from "@hapi/boom";

@Service()
export class NotificationService{

    constructor(
        @Inject() private _notificationRepo: NotificationRepository
    ) {
    }

    public async serveNotification() : Promise<Notification[]>{
        return await this._notificationRepo.getNotifications();
    }

    public async changeStatus(id:number, read_status: number) : Promise<Notification[]>{
        const status :  Notification[] = await this._notificationRepo.updateReadStatus(read_status, id)
        if(!status) throw badRequest("bad payload provided")
        return status;
    }

    public async createNotification(notification: string) : Promise<Notification[]> {
        let payload : {notification : string} = {notification};
        let newNotification : Notification[] = await this._notificationRepo.createNotification(payload);
        if(!newNotification || newNotification.length<1) throw badRequest("bad payload provided")
        return newNotification
    }
}
