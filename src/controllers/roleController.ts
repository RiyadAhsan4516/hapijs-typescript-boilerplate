import type { ReqRefDefaults, Request, ResponseToolkit } from '@hapi/hapi';
import { GetServiceResponse } from "../services/roleService";
import {Boom} from "@hapi/boom";

export class RoleController{
    async getRole(req: Request, h:ResponseToolkit<ReqRefDefaults>){
        let result = await GetServiceResponse()

        if(!result || result.length<1){
            throw new Boom("nothing found", {statusCode:404})
        }

        return result;
    }
}
