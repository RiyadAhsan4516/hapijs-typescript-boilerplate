// THIRD PARTY IMPORTS
import type {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import {Container, Service} from "typedi";
import {gzip} from "zlib";

// LOCAL IMPORTS
import {methodTypeCheck} from "../helpers/errorChecker";
import {RoleService} from "../services/roleService";
import {Roles} from "../entities/roleEntity";
import {payloadCompressor} from "../helpers/payloadCompressor";

@Service()
export class RoleController {

    public async getAllRoles(req: Request,  h: ResponseToolkit<ReqRefDefaults>) : Promise<ResponseObject> {
        // CHECK REQUEST METHOD
        methodTypeCheck(req.method, 'get')
        const service: RoleService = Container.get(RoleService);
        let data : Roles[] = await service.getAllRoles();
        let compressedData : Buffer = await payloadCompressor(data)
        return h.response(compressedData).header('Content-Encoding', 'gzip').type("application/json");
    }

    // FINISH SETTING UP REDIS OBJECT UPON CREATE
    public async createRoles(req:Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<any> {
        const payload : any = req.payload;
        let result : any = Container.get(RoleService).createRoles(payload)
        console.log(result);
    }

}
