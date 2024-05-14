import {Repository} from "typeorm";
import {AppDataSource} from "./data-source";
import {Service} from "typedi";
import {paginate} from "./helpers/paginator";


@Service()
export class RepoFactory {

    private repository: Repository<any>
    private entity : any

    public set repoSetter(entity: any){
        this.entity = entity
        this.repository = AppDataSource.getRepository(entity)
    }

    async create(payload: any){
        await this.repository.createQueryBuilder()
            .insert()
            .into(this.entity)
            .values(payload)
            .execute()
        return {message: "Data inserted successfully"}
    }

    async getAll(limit: number, pageNo: number, params: { [key: string]: string } | null = null): Promise<{
        total_count: number,
        data: any[]
    }> {
        let query: any = this.repository.createQueryBuilder()
        query = await this.addQuery(query, params)
        return await paginate(query, limit, pageNo, {"modified_at": "DESC"})
    }

    async getOne(id: string){
        return await this.repository.createQueryBuilder()
            .where("id = :id", {id})
            .maxExecutionTime(1000)
            .getOne()
    }

    async update(payload: any, id: string) {
        await this.repository.createQueryBuilder()
            .update(this.entity)
            .set(payload)
            .where("id = :id", {id})
            .execute()
        return {message: "Information updated successfully"}
    }

    async delete(id: string){
        await this.repository.createQueryBuilder()
            .delete()
            .from(this.entity)
            .where("id = :id", {id})
            .execute()

        return {message: "Data has been deleted"}
    }

    async addQuery(query: any, params: any) {
        // ADD QUERIES HERE
        return query
    }

}
