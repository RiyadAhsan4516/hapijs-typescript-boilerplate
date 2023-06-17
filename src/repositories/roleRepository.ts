import { AppDataSource } from "../data-source";
import { Roles } from "../entities/roleEntity";
import { Repository } from "typeorm";

export class RoleRepository{
    private _roleRepo: Repository<Roles>

    constructor(){
        this._roleRepo = AppDataSource.getRepository(Roles)
    }

    async getAll() : Promise<Roles[]>{
        return await this._roleRepo.find()
    }
}
