import {InsertResult, Repository} from "typeorm";
import {UserProfile} from "./userProfile.entity";
import { AppDataSource } from "../../data-source";
import {Service} from "typedi";

@Service()
export class UserProfileRepository{

    private readonly userProfileRepo : Repository<UserProfile>

    constructor(){
        this.userProfileRepo = AppDataSource.getRepository(UserProfile)
    }

    async createUserProfile(inputs: object) : Promise<any>{
        try{
            let newUserProfile : InsertResult = await this.userProfileRepo.createQueryBuilder()
                .insert()
                .into(UserProfile)
                .values(inputs)
                .returning(["id",'name', 'address', 'phone_number', 'profile_photo', 'user_id', 'role'])
                .execute()

            return newUserProfile.raw[0]
        }catch(err){
            return err
        }
    }

    async getAUserProfile (id:number) : Promise<any>{
        try{
            return await this.userProfileRepo.createQueryBuilder()
                .where("id = :id", {id})
                .maxExecutionTime(1000)
                .getOne()
        }catch(err){
            return {error: "Something went wrong"}
        }
    }


    async getAllProfiles () : Promise<UserProfile[] | {error: string}>{
        try{
            return await this.userProfileRepo.createQueryBuilder()
                .maxExecutionTime(1000)
                .getMany()
        }catch(err){
            return {error: "something went wrong"}
        }
    }

}
