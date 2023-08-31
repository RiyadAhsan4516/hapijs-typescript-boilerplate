import type {ReqRefDefaults, Request, ResponseToolkit} from '@hapi/hapi';
import {Boom} from "@hapi/boom";

export function  errorCatcher(fn : any) : any{
    return async (req : Request, h: ResponseToolkit<ReqRefDefaults>): Promise<any> =>{
        try{
            return await fn(req, h)
        }catch(err: any){
            throw new Boom("something went wrong", {statusCode: 500});
        }
    }
}
