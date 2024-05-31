import type {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import {Container, Service} from "typedi";
import {UserService} from "./userAccount.service";
import {User} from "./userAccount.entity";
import * as Boom from "@hapi/boom";
import {authorize} from "../authorization/authorization.access";
import {ResponseType} from "../../extensions";

@Service()
export class UserController{

    public async getUsers(req: Request, h : ResponseType) : Promise<ResponseObject>{
        // CALL CASBIN AUTHORIZE FUNCTION INSIDE THE CONTROLLER
        await authorize(`${req.auth.credentials.role}`, 'userList', "read")
        let limit : number = +req.params.limit;
        let pageNo : number = +req.params.pageNo;
        let params : {[key: string] : string} = {...req.query};
        let service : UserService = Container.get(UserService);
        let result : {total_count: number, data: any[]} = await service.getAll(limit, pageNo, params)
        if(!result || result.total_count<1) return h.response("No data found").code(204)
        return h.success(result, 200)
    }

    public async getUser(req: Request, h : ResponseType): Promise<ResponseObject>{
        let id : number = +req.params.id;
        let service : UserService = Container.get(UserService);
        let result : User | null = await service.getOne(id)
        if(!result) return h.response().code(204);
        return h.success(result,200)
    }

    public async CreateUser(req: Request, h : ResponseType) : Promise<User | ResponseObject>{
        // @ts-ignore
        let payload: any = {...req.payload};
        let service : UserService = Container.get(UserService);
        let result = await service.createUser(payload);
        if(!result || result.length<1){
            return h.response("No data found").code(204)
        }
        return h.success(result, 201);
    }

    public async UpdateUser(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<User>{
        let service : UserService = Container.get(UserService);
        let inputs : object;
        if(typeof req.payload === 'string') throw Boom.badData("payload has to be an object");
        else inputs = {...req.payload};

        return await service.updateUser(inputs, req.params.id)
    }
}
