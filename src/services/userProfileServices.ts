import { UserProfileRepository } from "../repositories/userProfileRepository";
import * as fs from "fs";
import Joi from 'joi';
import createError from "http-errors";

export class UserProfileService{

    private repository : UserProfileRepository

    constructor(){
        this.repository = new UserProfileRepository()
    }


    async createUserProfile(inputs: any, file: any){
        if (file) {
            const dest : string = 'public/' + file.filename;
            fs.rename(file.path, dest, (err) => {
                if (err) return {error: createError(500, "the file did not upload")}
            });
            inputs.profile_photo = '/' + file.filename;
        }
        return await this.repository.createUserProfile(inputs)
    }




    async getUserProfile(id:number){
        const validation  = this.validateIdInput(id)
        if(validation.error){
            console.log(validation.error);
            return {errno: 400, error: validation.error.details[0].message};
        }
        const result = await this.repository.getAUserProfile(id);
        if(result.length>0) return result
        else return {errno:404, error: "no result found"}
    }



    async getProfiles() {
        return await this.repository.getAllProfiles();
    }




    validateIdInput(input: number){
        const schema = Joi.object({
            id : Joi.number().required().messages({
                'number.base': "id should be of number type",
                'any.required': "id is a required field"
            })
        })
        return schema.validate({id: input}, {abortEarly: false})
    }


    validateCreateInput(input: object){
        const schema = Joi.object({
            email: Joi.string().email().messages({'string.base':"email should be of type string"}),
            password: Joi.string().min(8),
            userProfile_id: Joi.number().optional()
        })

        return schema.validate(input);
    }

}
