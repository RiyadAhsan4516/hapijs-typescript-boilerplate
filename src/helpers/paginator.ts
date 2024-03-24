import {SelectQueryBuilder} from "typeorm";

interface Order {
    [key: string] : "ASC" | "DESC"
}

export async function paginate(query : SelectQueryBuilder<any>, limit: number, pageNo: number, order : Order){
    let take : number = limit;
    let skip : number = (pageNo-1) * limit;

    let total_count: number = await query.getCount();

    const last_page : number = Math.ceil(total_count/limit);
    if(pageNo>last_page){
        skip = (last_page)*(limit);
    }

    let result : any[] =  await query
        .take(take)
        .skip(skip)
        .maxExecutionTime(1000)
        .orderBy(order)
        .getMany()

    return {total_count, result}
}
