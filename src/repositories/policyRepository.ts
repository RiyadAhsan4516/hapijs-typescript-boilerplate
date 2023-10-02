import { AppDataSource } from "../data-source";
import {PolicyReadStatus} from "../entities/policyEntity";
import {Repository} from "typeorm";
import {Service} from "typedi";

@Service()
export class PolicyRepository{
    private _policyRepo: Repository<PolicyReadStatus>

    constructor() {
        this._policyRepo = AppDataSource.getRepository(PolicyReadStatus)
    }

    async readStatus() : Promise<PolicyReadStatus[]> {
        return this._policyRepo.find();
    }
}
