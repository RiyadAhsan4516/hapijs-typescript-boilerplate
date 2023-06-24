import type {ReqRefDefaults, Request, ResponseToolkit} from '@hapi/hapi';
import {RoleService} from "../services/roleService";
import {Container, Service} from "typedi";

@Service()
export class RoleController {

    public async getAllRoles(req: Request,  h: ResponseToolkit<ReqRefDefaults>) {
        const service: RoleService = Container.get(RoleService);
        return await service.getAllRoles();
    }

}
