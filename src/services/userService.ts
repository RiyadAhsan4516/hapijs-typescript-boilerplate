import { UserRepository } from "../repositories/userRepository";
import {Service} from "typedi";
import {Container} from "typedi";

@Service()
export class UserService{

    private repository : UserRepository

    constructor(){
        this.repository = Container.get(UserRepository)
        console.log("hello from user repository")
    }



    async getAll(){
        return await this.repository.getAllUsers()
    }



    async getOne(id:number){
        // const validation : Joi.ValidationResult<any> = this.validateIdInput(id)
        // if(validation.error){
        //     return {error: validation.error};
        // }
        return await this.repository.getOneUser(id);
    }


    async createUser(inputs: object){

        return await this.repository.createUser(inputs)
    }


    async updateUser(inputs:any, id: string){
        return await this.repository.UpdateUser(inputs, id)
    }


}
