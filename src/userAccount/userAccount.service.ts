import {UserRepository} from "./userAccount.repository";
import {Service} from "typedi";
import {Container} from "typedi";
import {User} from "./userAccount.entity";

@Service()
export class UserService{

    private repository : UserRepository

    constructor(){
        this.repository = Container.get(UserRepository)
    }

    async getAll() : Promise<User[]>{
        return await this.repository.getAllUsers()
    }

    async getOne(id:number){
        return await this.repository.getOneUser(id);
    }


    async createUser(inputs: object){
        return await this.repository.createUser(inputs)
    }

    async updateUser(inputs:any, id: string){
        return await this.repository.UpdateUser(inputs, id)
    }


}
