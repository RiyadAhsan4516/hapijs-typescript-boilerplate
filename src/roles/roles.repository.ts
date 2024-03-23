import { AppDataSource } from "../data-source";
import {Roles} from "./roles.entity";
import { Repository } from "typeorm";
import {Service} from "typedi";

@Service()
export class RoleRepository{
    private _roleRepo: Repository<Roles>

    constructor(){
        this._roleRepo = AppDataSource.getRepository(Roles)
    }

    async getAll() : Promise<Roles[]>{
        return await this._roleRepo.find()
    }

    async create(payload: any) : Promise<Roles[]>{
        let result : Roles[] = this._roleRepo.create(payload)
        return await this._roleRepo.save(result);
    }
}
