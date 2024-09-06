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
            else if (err.sqlState && err.errno == 1062) return h.response(await errorPayload(409, "conflict", "duplicate entry found")).code(409)
            else if (err.sqlState && err.errno == 1451) return h.response(await errorPayload(400, "bad request", "cannot add/update/delete due to foreign key constraint")).code(400)
            else if (err.sqlState && err.errno == 1452) return h.response(await errorPayload(400, "bad request", "foreign key fail. id/data either does not exist or cannot be deleted/inserted")).code(400)
            else if (err.sqlState && err.errno == 1064) return h.response(await errorPayload(400, "bad request", "sql syntax has error in it")).code(400)
            else if (err.sqlState && err.errno == 1205) return h.response(await errorPayload(503, "service unavailable", "transaction taking too long!")).code(503)
            else if (err.sqlState && err.errno == 1111) return h.response(await errorPayload(400, "bad request", "sql group functions (SUM, AVG, etc.) used incorrectly")).code(400)
            else if (err.sqlState && err.errno) return h.response(await errorPayload(400, "bad request", err.sqlMessage)).code(400);
            else {
                return h.response(await errorPayload(418, "server issue", "Take a sip of tea while I fix my code")).code(418)
            }
        }
    }
}
