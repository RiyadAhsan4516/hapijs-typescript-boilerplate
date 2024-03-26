import {UserRepository} from "./userAccount.repository";
import {Service} from "typedi";
import {Container} from "typedi";

@Service()
export class UserService {

    private repository: UserRepository

    constructor() {
        this.repository = Container.get(UserRepository)
    }

    async getAll(limit: number, pageNo: number, params: { [key: string]: string }): Promise<{ total_count: number, data: any[] }> {
        return await this.repository.getAllUsers(limit, pageNo, params)
    }

    async getOne(id: number) {
        return await this.repository.getOneUser(id);
    }


    async createUser(inputs: object) {
        return await this.repository.createUser(inputs)
    }

    async updateUser(inputs: any, id: string) {
        return await this.repository.UpdateUser(inputs, id)
    }


}