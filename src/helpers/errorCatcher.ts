import type {ReqRefDefaults, Request, ResponseToolkit} from '@hapi/hapi';
import {teapot} from "@hapi/boom";


export function  errorCatcher(fn : any) : any{
    return async (req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<any> => {
        try {
            return await fn(req, h)
        } catch (err: any) {
            if(process.env.NODE_ENV == "development") console.log(err)
            if (err.isBoom) return h.response(err.output.payload).code(err.output.statusCode)
            else if (err.sqlState && err.errno == 1062) return h.response("Duplicate Entry found").code(400)
            else if (err.sqlState && err.errno == 1451) return h.response("cannot add/update/delete due to foreign key constraint").code(400)
            else if (err.sqlState && err.errno) return h.response({
                statusCode: 422,
                error: "unprocessable entity",
                message: err.sqlMessage
            }).code(422);
            throw teapot("sip on your tea while i fix my code :)")
        }
    }
}
