import {InsertResult, Repository, SelectQueryBuilder, UpdateResult} from "typeorm";
import {User} from "./userAccount.entity";
import { AppDataSource } from "../../data-source";
import {Service} from "typedi";
import { paginate } from "../../helpers/paginator";

@Service()
export class UserRepository{

    private userRepo : Repository<User>

    constructor(){
        this.userRepo = AppDataSource.getRepository(User)
    }

    async getAllUsers(limit: number, pageNo: number, params : {[key : string]: string}) : Promise<{total_count: number, data: any[]}> {
        let query: SelectQueryBuilder<User> = this.userRepo.createQueryBuilder()
        query = await this.addQuery(query, params)
        return await paginate(query, limit, pageNo, {"modified_at": "DESC"})
    }

    async getOneUser(id: number): Promise<User | null>{
        return await this.userRepo.createQueryBuilder()
            .where("User.id = :id", {id})
            .innerJoin("User.role_id", "role")
            .addSelect(["role.id", "role.name"])
            .maxExecutionTime(1000)
            .getOne()
    }

    async getUserWithPassword(email: string) : Promise<User | null>{
        return await this.userRepo.createQueryBuilder()
            .select(["User.id", "User.email", "User.password"])
            .innerJoin("User.role_id", "role")
            .addSelect(["role.id", "role.name"])
            .where("User.email = :email", {email: email})
            .getOne();
    }

    async createUser(inputs: object) : Promise<any>{

        try{
            let newUser : InsertResult = await this.userRepo.createQueryBuilder()
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
        let {...newInputs}= inputs
        // @ts-ignore
        let user : UpdateResult = await this.userRepo.createQueryBuilder()
            .update(User)
            .set(newInputs)
            .where(id)
            .execute()

        return user.raw

    }

    async addQuery(query: SelectQueryBuilder<any>, params: {[key: string]: string}) : Promise<SelectQueryBuilder<any>> {
        if(params.email) query = query.andWhere("User.email LIKE :email", {email: `%${params.email}%`})
        return query
    }
}
