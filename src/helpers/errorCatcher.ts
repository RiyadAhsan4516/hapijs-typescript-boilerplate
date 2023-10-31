import type {ReqRefDefaults, Request, ResponseToolkit} from '@hapi/hapi';
import * as Boom from '@hapi/boom';

export function  errorCatcher(fn : any) : any{
    return async (req : Request, h: ResponseToolkit<ReqRefDefaults>): Promise<any> =>{
        try{
            return await fn(req, h)
        }catch(err: any){
            if(err.isBoom) return h.response(err.output.payload).code(err.output.statusCode)
            console.log(err);
            throw Boom.teapot()
        }
    }
}
