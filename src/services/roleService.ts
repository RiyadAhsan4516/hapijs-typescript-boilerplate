import { RoleRepository } from "../repositories/roleRepository";
import {Roles} from "../entities/roleEntity";
import {Service, Container} from "typedi";
import {Boom} from "@hapi/boom";

@Service()
export class RoleService{
    private _roleRepo: RoleRepository

    constructor() {
        this._roleRepo = Container.get(RoleRepository);
    }

    public async getAllRoles(){
        const result: Roles[] =  await this._roleRepo.getAll();
        if(!result || result.length<1) throw new Boom("", {statusCode:204})
        return result;
    }

    public async createRoles(payload: any) : Promise<Roles[]>{
        const result: Roles[] = await this._roleRepo.create(payload)
        return result
    }

}
