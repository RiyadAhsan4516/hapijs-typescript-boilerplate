import type {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import {Container, Service} from "typedi";
import * as Boom from "@hapi/boom";
import {NotificationService} from "./notification.service";
import {Notification} from "./notification.entity";

@Service()
export class NotificationController{
    // POST A NOTIFICATION. INITIALLY WITH THE STATUS 0
    public async createNotification(req: Request, h:ResponseToolkit<ReqRefDefaults>){
        //@ts-ignore
        let notification : string = req.payload["notification"];
        let result : Notification[] =  await Container.get(NotificationService).createNotification(notification);
        if(result.length<1) throw Boom.badRequest("no notification was created");
        return result;
    }

    // SERVE NOTIFICATION USING SSE CONNECTION. SET STATUS TO 1 AFTER BEING SENT

    // RAW METHOD =>
    // public async getNotification(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<ResponseObject>{
    //     // @ts-ignore
    //     // class ResponseStream extends Stream.PassThrough {
    //     //     setCompressor(compressor: any) : void {
    //     //         // @ts-ignore
    //     //         this._compressor = compressor;
    //     //     }
    //     // }
    //
    //     // const stream : ResponseStream = new ResponseStream();
    //     const stream : PassThrough = new PassThrough();
    //     let service : NotificationService = Container.get(NotificationService);
    //
    //     let intervalId : NodeJS.Timer = setInterval(async () => {
    //         let data : Notification[] = await service.serveNotification();
    //         if (data.length > 0) {
    //             for(let i: number = 0 ; i<data.length; i++){
    //                 stream.write(`id: ${data[i].id}\n`);
    //                 stream.write('data:' + data[i].notification + ';\n\n');
    //
    //                 // CHANGE READ STATUS
    //                 await service.changeStatus(data[i].id, 1);
    //             }
    //         }
    //         //@ts-ignore
    //         // stream._compressor.flush();
    //     }, 100);
    //
    //     req.raw.req.on('close', () => {
    //         clearInterval(intervalId);
    //         stream.end();
    //     })
    //
    //     return h.response(stream).type('text/event-stream')
    // }

    // USING PACKAGE =>
    public async getNotification(req: Request, h:any) : Promise<ResponseObject>{
        let service : NotificationService = Container.get(NotificationService);
        let res = h.event({id: 0, data : "Event source initiated"})
        let intervalId : NodeJS.Timer | any = setInterval(async () => {
            let data : Notification[] = await service.serveNotification();
            if (data.length > 0) {
                for(let i: number = 0 ; i<data.length; i++){
                    h.event({id : data[i].id, data : data[i].notification})
                    // CHANGE READ STATUS
                    await service.changeStatus(data[i].id, 1);
                }
            }
        }, 1000);

        req.raw.req.on('close', () => {
            if(intervalId) clearInterval(intervalId);
        })

        return h.response(res)
    }


    // CHANGE NOTIFICATION STATUS TO 2 WHEN IT IS READ
    public async changeReadStatus(req: Request, h:ResponseToolkit<ReqRefDefaults>){
        let id : number = +req.params["id"];
        return await Container.get(NotificationService).changeStatus(+id, 2);
    }

}
