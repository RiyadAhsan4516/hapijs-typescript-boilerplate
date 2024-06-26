import {UserProfileRepository} from "./userProfile.repository";
import {fileProcessor} from "../../helpers/fileProcessor";
import {Container, Service} from "typedi";
import {ObjectSchema, object, number, string} from "joi"
import {imageResizer} from "../../helpers/imageResizer";
import {InsertResult} from "typeorm";

@Service()
export class UserProfileService {

    private repository: UserProfileRepository

    constructor() {
        this.repository = Container.get(UserProfileRepository);
    }


    async createUserProfile(inputs: any): Promise<InsertResult> {
        if (inputs.profile_photo) {
            let path: string = await fileProcessor(
                inputs.profile_photo,
                ["jpeg", "png", "webp"],
                3000000,
                "profile"
            );
            inputs.profile_photo = await imageResizer({width: 100, height: 100}, path)
        }
        return await this.repository.createUserProfile(inputs)
    }


    async getUserProfile(id: number) {
        const validation = this.validateIdInput(id)
        if (validation.error) {
            return {errno: 400, error: validation.error.details[0].message};
        }
        const result = await this.repository.getAUserProfile(id);
        if (result.length > 0) return result
        else return {errno: 404, error: "no result found"}
    }


    async getProfiles() {
        return await this.repository.getAllProfiles();
    }


    validateIdInput(input: number) {
        const schema = object({
            id: number().required().messages({
                'number.base': "id should be of number type",
                'any.required': "id is a required field"
            })
        })
        return schema.validate({id: input}, {abortEarly: false})
    }


    validateCreateInput(input: object) {
        const redisSchemas: ObjectSchema<any> = object({
            email: string().email().messages({'string.base': "email should be of type string"}),
            password: string().min(8),
            userProfile_id: number().optional()
        })

        return redisSchemas.validate(input);
    }

}
