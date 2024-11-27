import {InsertResult, Repository, SelectQueryBuilder, UpdateResult} from "typeorm";
import {UserAccountEntity} from "./userAccount.entity";
import {AppDataSource} from "../../data-source";
import {Service} from "typedi";
import {paginate} from "../../helpers/paginator";
import {badRequest} from "@hapi/boom";

@Service()
export class UserAccountRepository {

    private userRepo: Repository<UserAccountEntity>

    constructor() {
        this.userRepo = AppDataSource.getRepository(UserAccountEntity)
    }

    async getAllUsers(limit: number, pageNo: number, params: { [key: string]: string }): Promise<{
        total_count: number,
        data: any[]
    }> {
        let query: SelectQueryBuilder<UserAccountEntity> = this.userRepo.createQueryBuilder()
        query = await this.addQuery(query, params)
        return await paginate(query, limit, pageNo, {"modified_at": "DESC"})
    }

    async getOneUser(id: number): Promise<UserAccountEntity | null> {
        return await this.userRepo.createQueryBuilder()
            .where("User.id = :id", {id})
            .innerJoin("User.role_id", "role")
            .addSelect(["role.id", "role.name"])
            .maxExecutionTime(1000)
            .getOne()
    }

    async getUserWithPassword(email: string): Promise<UserAccountEntity | null> {
        return await this.userRepo.createQueryBuilder()
            .select(["UserAccountEntity.id", "UserAccountEntity.email", "UserAccountEntity.password"])
            .innerJoin("UserAccountEntity.role_id", "role")
            .addSelect(["role.id", "role.name"])
            .where("UserAccountEntity.email = :email", {email: email})
            .getOne();
    }

    async createUser(inputs: object): Promise<any> {
        let newUser: InsertResult = await this.userRepo.createQueryBuilder()
            .insert()
            .into(UserAccountEntity)
            .values(inputs)
            .returning(["id", 'email', "account_created_at"])
            .execute()
        console.log(newUser)
        return newUser.raw[0]

    }

    async UpdateUser(inputs: any, id: string): Promise<UserAccountEntity> {
        let {...newInputs} = inputs
        // @ts-ignore
        let user: UpdateResult = await this.userRepo.createQueryBuilder()
            .update(UserAccountEntity)
            .set(newInputs)
            .where(id)
            .execute()

        return user.raw

    }

    // PASSWORD RECOVERY
    async setRecoveryCode(code: string, expiration_time:string, user_id: string){
        await this.userRepo.createQueryBuilder()
            .update()
            .set({
                password_reset_code : code,
                reset_code_expired_at : expiration_time
            })
            .where("id = :user_id", {user_id})
            .execute()
    }

    async getUserWithCode(code: string) : Promise<UserAccountEntity>{
        let user : UserAccountEntity | null = await this.userRepo.createQueryBuilder()
            .select(["User.id", "User.email", "User.password_reset_code", "User.reset_code_expired_at"])
            .where("User.password_reset_code = :code", {code: code})
            .innerJoinAndSelect("User.role_id", "role")
            .getOne();

        if(!user) throw badRequest("invalid code provided")

        return user
    }

    async resetPassword(password: string, id: string){
        await this.userRepo.createQueryBuilder()
            .update()
            .set({password})
            .where("id = :id", {id})
            .execute()

        return {message: "password changed successfully"}
    }

    async getUserWithEmail(email: string): Promise<UserAccountEntity | null> {
        return await this.userRepo.createQueryBuilder()
            .select(["User.id", "User.email", "User.password"])
            .innerJoinAndSelect("User.role_id", "role")
            .where("User.email = :email", {email: email})
            .getOne();
    }

    async addQuery(query: SelectQueryBuilder<any>, params: {
        [key: string]: string
    }): Promise<SelectQueryBuilder<any>> {
        if (params.email) query = query.andWhere("User.email LIKE :email", {email: `%${params.email}%`})
        return query
    }
}
