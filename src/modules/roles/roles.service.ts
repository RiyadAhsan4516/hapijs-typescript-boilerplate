import {RoleRepository} from "./roles.repository";
import {Roles} from "./roles.entity";
import {Inject, Service} from "typedi";
import {Boom} from "@hapi/boom";

@Service()
export class RoleService{


    constructor(
        @Inject() private _roleRepo: RoleRepository
    ) {
    }

    public async getAllRoles(){
        const result: Roles[] =  await this._roleRepo.getAll();
        if(!result || result.length<1) throw new Boom("", {statusCode:204})
        return result;
    }

    public async createRoles(payload: any) : Promise<Roles[]>{
        const result : Roles[] = await this._roleRepo.create(payload)
        if(!result || result.length<1) throw new Boom("query failed", {statusCode: 418})
        return result;
    }

}
