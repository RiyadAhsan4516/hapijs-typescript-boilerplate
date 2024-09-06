// THIRD PARTY IMPORTS
import type {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import {Inject, Service} from "typedi";
import {ResponseType} from "../../extensions";
// import {gzip} from "zlib";
// LOCAL IMPORTS
import {RoleService} from "./roles.service";
import {Roles} from "./roles.entity";

@Service()
export class RoleController {

    constructor(
        @Inject() private service : RoleService
    ) {
    }

    public async getAllRoles(req: Request, h: ResponseType): Promise<ResponseObject>  {
        //FETCH DATA FROM REPOSITORY
        let data : Roles[] = await this.service.getAllRoles();

        // CHECK THE LENGTH OF DATA ARRAY
        if(data.length<1) return h.response("no data found").code(204)

        return h.success(data, 200)
    }

    // FINISH SETTING UP REDIS OBJECT UPON CREATION
    public async createRoles(req:Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<any> {
        const payload : any = req.payload;
        let result : any = this.service.createRoles(payload)
        console.log(result);
    }

}
