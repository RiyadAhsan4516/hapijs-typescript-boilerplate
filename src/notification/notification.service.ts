import {Service, Container} from "typedi";
// import {Boom} from "@hapi/boom";
import * as Boom from "@hapi/boom";
import {NotificationRepository} from "./notification.repository";
import {Notification} from "./notification.entity";

@Service()
export class NotificationService{
    private _notificationRepo: NotificationRepository

    constructor() {
        this._notificationRepo = Container.get(NotificationRepository);
    }

    public async serveNotification() : Promise<Notification[]>{
        return await this._notificationRepo.getNotifications();
    }

    public async changeStatus(id:number, read_status: number) {
        const status :  Notification[] = await this._notificationRepo.updateReadStatus(read_status, id)
        if(!status) throw Boom.badRequest("bad payload provided")
        return status;
    }

    public async createNotification(notification: string) : Promise<Notification[]> {
        let payload : {notification : string} = {notification};
        let newNotification : Notification[] = await this._notificationRepo.createNotification(payload);
        if(!newNotification || newNotification.length<1) throw Boom.badRequest("bad payload provided")
        return newNotification
    }
}
