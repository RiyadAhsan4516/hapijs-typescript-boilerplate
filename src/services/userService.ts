import { UserRepository } from "../repositories/userRepository";
import Joi from 'joi';

export class UserService{

    private repository : UserRepository

    constructor(){
        this.repository = new UserRepository()
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



    validateIdInput(input: number){
        const schema = Joi.object({
            id : Joi.number().required()
        })
        return schema.validate({id: input})
    }


    validateCreateInput(input: object){
        const schema : Joi.ObjectSchema<any> = Joi.object({
            email: Joi.string().email(),
            password: Joi.string().min(8),
            userProfile_id: Joi.number().optional()
        })

        return schema.validate(input);
    }

}
