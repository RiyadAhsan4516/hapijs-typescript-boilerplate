import type {ReqRefDefaults, Request, ResponseToolkit} from '@hapi/hapi';

async function errorPayload (statusCode: number, error: string, message: any){
    return {statusCode, error, message}
}

export function  errorCatcher(fn : any) : any{
    return async (req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<any> => {
        try {
            return await fn(req, h)
        } catch (err: any) {
            if(process.env.NODE_ENV == "development") console.log(err)
            if (err.isBoom) return h.response(err.output.payload).code(err.output.statusCode)
            else if (err.sqlState && err.errno == 1062) return h.response(await errorPayload(400, "bad request", "duplicate entry found")).code(400)
            else if (err.sqlState && err.errno == 1451) return h.response(await errorPayload(400, "bad request", "cannot add/update/delete due to foreign key constraint")).code(400)
            else if (err.sqlState && err.errno) return h.response(await errorPayload(422, "unprocessable entity", err.sqlMessage)).code(422);
            else return h.response(await errorPayload(418, "server issue", "fatal error occurred")).code(418)
        }
    }
}
