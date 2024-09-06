import {Repository, SelectQueryBuilder} from "typeorm";
import {AppDataSource} from "../../data-source";
import {Service} from "typedi";
import {AuthTokensEntity} from "./authTokens.entity";
import {paginate} from "../../helpers/paginator";
import {badRequest} from "@hapi/boom";


@Service()
export class AuthTokensRepository {

    private repository: Repository<AuthTokensEntity>

    constructor() {
        this.repository = AppDataSource.getRepository(AuthTokensEntity)
    }

    async create(payload: any){
        await this.repository.createQueryBuilder()
            .insert()
            .into(AuthTokensEntity)
            .values(payload)
            .execute()
        return {message: ""}
    }

    async getAll(limit: number, pageNo: number, params: { [key: string]: string } | null = null): Promise<{
        total_count: number,
        data: any[]
    }> {
        let query: SelectQueryBuilder<AuthTokensEntity> = this.repository.createQueryBuilder()
        query = await this.addQuery(query, params)
        return await paginate(query, limit, pageNo, {"modified_at": "DESC"})
    }

    async getUsingRefresh(refresh_token: string){
        let result =  await this.repository.createQueryBuilder()
            .where("refresh_token = :refresh_token", {refresh_token})
            .maxExecutionTime(1000)
            .getOne()
        if(!result) throw badRequest("No entry found in database token table")
        return result
    }

    async updateUsingRefresh(payload: any, refresh_token: string) {
        await this.repository.createQueryBuilder()
            .update(AuthTokensEntity)
            .set(payload)
            .where("refresh_token = :refresh_token", {refresh_token})
            .execute()
        return {message: ""}
    }

    async delete(id: string){
        await this.repository.createQueryBuilder()
            .delete()
            .from(AuthTokensEntity)
            .where("id = :id", {id})
            .execute()

        return {message: ""}
    }

    async addQuery(query: any, params: any) {
        // ADD QUERIES HERE
        return query
    }

}
