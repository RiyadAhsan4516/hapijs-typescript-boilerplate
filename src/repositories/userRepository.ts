import {Repository, UpdateResult} from "typeorm";
import { User } from "../entities/userEntity";
import { AppDataSource } from "../data-source";
import {Service} from "typedi";

@Service()
export class UserRepository{

    private userRepo : Repository<User>

    constructor(){
        this.userRepo = AppDataSource.getRepository(User)
    }

    async getAllUsers(): Promise<User[]>{
        return await this.userRepo.find()
    }

    async getOneUser(id: number): Promise<User | null>{
        return await this.userRepo.findOneBy({id})
    }

    async getUserWithPassword(email: string) : Promise<User | null>{
        return await this.userRepo.createQueryBuilder("user")
            .select(["user.id", "user.email", "user.password"])
            .where("user.email = :email", {email: email})
            .getOne();
    }

    async createUser(inputs: object) : Promise<any>{

        try{
            let newUser = await this.userRepo.createQueryBuilder()
                .insert()
                .into(User)
                .values(inputs)
                .returning(["id",'email'])
                .execute()

            return newUser.raw
        }catch(err){
            return err
        }
    }

    async UpdateUser(inputs : any, id: string): Promise<User>{
        let {...newInputs} = inputs

        let user : UpdateResult = await this.userRepo.createQueryBuilder()
            .update(User)
            .set(newInputs)
            .where(id)
            .execute()

        return user.raw

    }

    // async DeleteUser(input: number): Promise<void> {
    //     await this.userRepo.createQueryBuilder()
    //         .delete()
    //         .from(User)
    //         .where({id: input})
    //         .execute()
    // }
}
