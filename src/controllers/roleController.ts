import type {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import {RoleService} from "../services/roleService";
import {Container, Service} from "typedi";
import * as zlib from "zlib"

@Service()
export class RoleController {

    public async getAllRoles(req: Request,  h: ResponseToolkit<ReqRefDefaults>) : Promise<ResponseObject> {
        const service: RoleService = Container.get(RoleService);
        const compressedData : Buffer = zlib.gzipSync(JSON.stringify(await service.getAllRoles()));
        return h.response(compressedData).header('Content-Encoding', 'gzip').type("application/json");
    }

}
