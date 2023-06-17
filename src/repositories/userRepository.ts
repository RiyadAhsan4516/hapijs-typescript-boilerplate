import { Repository } from "typeorm";
import { User } from "../entities/userEntity";
import { AppDataSource } from "../data-source";

export class UserRepository{

    private userRepo : Repository<User>

    constructor(){
        this.userRepo = AppDataSource.getRepository(User)
    }

    async getAllUsers(): Promise<User[]>{
        return await this.userRepo.find()
    }

    async getOneUser(id: number): Promise<User | null>{
        console.log(id);
        return await this.userRepo.findOneBy({id})
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

        let user = await this.userRepo.createQueryBuilder()
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
