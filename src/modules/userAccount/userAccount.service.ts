import {UserAccountRepository} from "./userAccount.repository";
import {Inject, Service} from "typedi";
import moment from "moment";
import {UserAccountEntity} from "./userAccount.entity";
import {RepoFactory} from "../../factory";


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
        inputs["account_creation_date"] = moment().format("YYYY-MM-DD HH:mm:ss")
        return await this.repository.createUser(inputs)
    }

    async updateUser(inputs: any, id: string) {
        return await this.factory.update(inputs, id)
    }


}
