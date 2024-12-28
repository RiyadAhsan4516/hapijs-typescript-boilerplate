import {UserAccountRepository} from "./userAccount.repository";
import {Inject, Service} from "typedi";

import {UserAccountEntity} from "./userAccount.entity";
import {RepoFactory} from "../../factory";
import {format} from "date-fns";


@Service()
export class UserAccountService {

    constructor(
        @Inject() private repository: UserAccountRepository,
        @Inject() private factory : RepoFactory<UserAccountEntity>
    ) {
    }

    async getAll(limit: number, pageNo: number, params: { [key: string]: string }): Promise<{ total_count: number, data: any[] }> {
        return await this.repository.getAllUsers(limit, pageNo, params)
    }

    async getOne(id: number): Promise<UserAccountEntity | null> {
        return await this.repository.getOneUser(id);
    }


    async createUser(inputs: any) {
        inputs["account_creation_date"] = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        return await this.repository.createUser(inputs)
    }

    async updateUser(inputs: any, id: string) {
        return await this.factory.update(inputs, id)
    }


}
