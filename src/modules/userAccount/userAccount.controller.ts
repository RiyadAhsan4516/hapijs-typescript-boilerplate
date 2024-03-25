import type {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import {Container, Service} from "typedi";
import {UserService} from "./userAccount.service";
import {User} from "./userAccount.entity";
import * as Boom from "@hapi/boom";
import {payloadFormatter} from "../../helpers/payloadFormatter";

@Service()
export class UserController{

    public async getUsers(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<ResponseObject>{
        let limit : number = +req.params.limit;
        let pageNo : number = +req.params.pageNo;
        let params : {[key: string] : string} = {...req.query};
        let service : UserService = Container.get(UserService);
        let result : {total_count: number, data: any[]} = await service.getAll(limit, pageNo, params)
        if(!result || result.total_count<1) return h.response("No data found").code(204)
        return h.response(await payloadFormatter(result)).code(200)
    }

    public async getUser(req: Request, h:ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject>{
        let service : UserService = Container.get(UserService);
        let id = req.params.id;
        let result : User | null = await service.getOne(id)
        if(!result) return h.response("No user found with this id").code(204)
        return h.response(await payloadFormatter(result)).code(200)
    }

    public async CreateUser(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<User | ResponseObject>{
        let service : UserService = Container.get(UserService);
        let inputs : object
        if(typeof req.payload === 'string') throw Boom.badData("payload has to be an object");
        else inputs = {...req.payload};
        let result = await service.createUser(inputs);
        if(!result || result.length<1){
            return h.response("No data found").code(204)
        }

        return result;
    }

    public async UpdateUser(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<User>{
        let service : UserService = Container.get(UserService);
        let inputs : object;
        if(typeof req.payload === 'string') throw Boom.badData("payload has to be an object");
        else inputs = {...req.payload};

        return await service.updateUser(inputs, req.params.id)
    }
}
