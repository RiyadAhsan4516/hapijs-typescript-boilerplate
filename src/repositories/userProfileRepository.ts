import { Repository } from "typeorm";
import { UserProfile } from "../entities/userProfileEntity";
import { AppDataSource } from "../data-source";

export class UserProfileRepository{

    private readonly userProfileRepo : Repository<UserProfile>

    constructor(){
        this.userProfileRepo = AppDataSource.getRepository(UserProfile)
    }

    async createUserProfile(inputs: object) : Promise<any>{
        try{
            let newUserProfile = await this.userProfileRepo.createQueryBuilder()
                .insert()
                .into(UserProfile)
                .values(inputs)
                .returning(["id",'name', 'address', 'phone_number', 'profile_photo', 'user_id', 'role'])
                .execute()

            return newUserProfile.raw[0]
        }catch(err){
            console.log(err);
            return err
        }
    }

    async getAUserProfile (id:number) : Promise<any>{
        try{
            return await this.userProfileRepo.find({
                where: {id},
                relations:{
                    role: true,
                    user_id: true
                },
            })
        }catch(err){
            return {error: "Something went wrong"}
        }
    }


    async getAllProfiles () : Promise<UserProfile[] | {error: string}>  {
        try{
            return await this.userProfileRepo.find({
                relations:{
                    role: true,
                    user_id: true
                }
            })
        }catch(err){
            return {error: "something went wrong"}
        }
    }

}
