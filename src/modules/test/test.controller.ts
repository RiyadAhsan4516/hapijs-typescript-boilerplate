import type {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import {Service} from "typedi";
import {fileProcessor} from "../../helpers/fileProcessor";


@Service()
export class TestController {

    public async getAll(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<ResponseObject>{
        // let limit : number = +req.params.limit;
        // let pageNo : number = +req.params.pageNo;
        // let params : {[key: string] : string} = {...req.query};
        // @ts-ignore
        let request : any = {...req}
        console.log(request.plugins["scooter"].source)
        return h.response("check terminal").code(200);
        // let service : UserService = Container.get(UserService);
        // let result : {total_count: number, data: any[]} = await service.getAll(limit, pageNo, params)
        // if(!result || result.total_count<1) return h.response("No data found").code(204)
        // return h.response(await payloadFormatter(result)).code(200)
    }
    public async upload(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<ResponseObject>{
        //@ts-ignore
        let path: string = await fileProcessor(req.payload.photo, ["jpg", "jpeg", "png"], 2000000)
        return h.response(path).code(200)
    }

    // public async getOne(req: Request, h:ResponseToolkit<ReqRefDefaults>): Promise<RequestObject>{
    //     let id : number = +req.params.id;
    //     // let service : UserService = Container.get(UserService);
    //     // let result : User | null = await service.getOne(id)
    //     // if(!result) return h.response("No user found with this id").code(204)
    //     // return h.response(await payloadFormatter(result)).code(200)
    // }
    //
    // public async create(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<RequestObject>{
    //     // @ts-ignore
    //     let payload: any = {...req.payload};
    //     // let service : UserService = Container.get(UserService);
    //     // let result = await service.createUser(payload);
    //     // if(!result || result.length<1){
    //         // return h.response("No data found").code(204)
    //     // }
    //     // return h.response(await payloadFormatter(result)).code(201);
    // }
    //
    // public async update(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<RequestObject>{
    //
    // }
    //
    // public async delete(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<RequestObject>{
    //
    // }


}
