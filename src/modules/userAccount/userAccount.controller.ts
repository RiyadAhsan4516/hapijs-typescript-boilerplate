import type {Request, ResponseObject} from '@hapi/hapi';
import {Inject, Service} from "typedi";
import {UserAccountService} from "./userAccount.service";
import {ResponseType} from "../../extensions";
import {UserAccountEntity} from "./userAccount.entity";
import {badData} from "@hapi/boom";
import {CasbinEnforcer} from "../authorization/authorization.access";

@Service()
export class UserAccountController{

    constructor(
        @Inject() private readonly service: UserAccountService,
        @Inject() private readonly authorization: CasbinEnforcer
    ) {
    }

    public async getUsers(req: Request, h: ResponseType): Promise<ResponseObject>{
        // CALL CASBIN AUTHORIZE FUNCTION INSIDE THE CONTROLLER
        await this.authorization.checkAuthorization(`${req.auth.credentials.role}`, 'userList', "read")
        let limit : number = +req.params.limit;
        let pageNo : number = +req.params.pageNo;
        let params : {[key: string] : string} = {...req.query};
        let result : {total_count: number, data: any[]} = await this.service.getAll(limit, pageNo, params)
        if(!result || result.total_count<1) return h.response().code(204)
        return h.success(result, 200)
    }

    public async getUser(req: Request, h : ResponseType): Promise<ResponseObject>{
        let id : number = +req.params.id;

        let result : UserAccountEntity | null = await this.service.getOne(id)
        if(!result) return h.response().code(204);
        return h.success(result,200)
    }

    public async CreateUser(req: Request, h : ResponseType) : Promise<UserAccountEntity | ResponseObject>{
        // @ts-ignore
        let payload: any = {...req.payload};

        let result = await this.service.createUser(payload);
        if(!result || result.length<1){
            return h.response().code(204)
        }
        return h.success(result, 201);
    }

    public async UpdateUser(req: Request, h : ResponseType) : Promise<ResponseObject>{

        let inputs : object;
        if(typeof req.payload === 'string') throw badData("payload has to be an object");
        else inputs = {...req.payload};

        let result : { message: string } =  await this.service.updateUser(inputs, req.params.id)

        return h.success(result, 200)
    }
}
