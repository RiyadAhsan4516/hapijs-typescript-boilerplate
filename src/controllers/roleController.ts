import type {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import {RoleService} from "../services/roleService";
import {Container, Service} from "typedi";
import {methodTypeCheck} from "../helpers/errorChecker";
import * as zlib from "zlib";

@Service()
export class RoleController {

    public async getAllRoles(req: Request,  h: ResponseToolkit<ReqRefDefaults>) : Promise<ResponseObject> {
        // CHECK REQUEST METHOD
        methodTypeCheck(req.method, 'get')
        const service: RoleService = Container.get(RoleService);
        const compressedData : Buffer = zlib.gzipSync(JSON.stringify(await service.getAllRoles()));   // Compress data using zlib
        return h.response(compressedData).header('Content-Encoding', 'gzip').type("application/json");
    }

}
