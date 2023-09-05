import type {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import {Container, Service} from "typedi";
import * as Stream from "stream";
import {Boom} from "@hapi/boom";
import {NotificationService} from "../services/notificationService";
import {Notification} from "../entities/notificationEntity"

@Service()
export class NotificationController{
    // POST A NOTIFICATION. INITIALLY WITH THE STATUS 0
    public async createNotification(req: Request, h:ResponseToolkit<ReqRefDefaults>){
        //@ts-ignore
        let notification : string = req.payload["notification"];
        let result : Notification[] =  await Container.get(NotificationService).createNotification(notification);
        if(result.length<1) throw new Boom("no notification was created", {statusCode: 400});
        return result;
    }

    // SERVE NOTIFICATION USING SSE CONNECTION. SET STATUS TO 1 AFTER BEING SENT
    public async getNotification(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<ResponseObject>{
        // noinspection JSUnusedGlobalSymbols
        class ResponseStream extends Stream.PassThrough {
            setCompressor(compressor: any) : void {
                // @ts-ignore
                this._compressor = compressor;
            }
        }

        const stream : ResponseStream = new ResponseStream();
        let service : NotificationService = Container.get(NotificationService);

        let intervalId : NodeJS.Timer = setInterval(async () => {
            let data : Notification[] = await service.serveNotification();
            if (data.length > 0) {
                for(let i = 0 ; i<data.length; i++){
                    stream.write(`id: ${data[i].id}\n`);
                    stream.write('data:' + data[i].notification + ';\n\n');

                    // CHANGE READ STATUS
                    await service.changeStatus(data[i].id, 1);
                }
            }
            //@ts-ignore
            stream._compressor.flush();
        }, 100);

        req.raw.req.on('close', () => {
            clearInterval(intervalId);
            stream.end();
        })

        return h.response(stream).type('text/event-stream')
    }

    // CHANGE NOTIFICATION STATUS TO 2 WHEN IT IS READ
    public async changeReadStatus(req: Request, h:ResponseToolkit<ReqRefDefaults>){
        let id : number = +req.params["id"];
        console.log(id);
        return await Container.get(NotificationService).changeStatus(+id, 2);
    }

}
