import type { ReqRefDefaults, Request, ResponseToolkit } from '@hapi/hapi';
import {Container, Service} from "typedi";
import { UserService } from "../services/userService"
import {Boom} from "@hapi/boom";

@Service()
export class UserController{

    public async getUsers(req: Request, h:ResponseToolkit<ReqRefDefaults>){
        let service = Container.get(UserService);
        let result = await service.getAll()
        if(!result || result.length<1) throw new Boom("no users found", {statusCode:404});
        return result
    }

    public async getUser(req: Request, h:ResponseToolkit<ReqRefDefaults>){
        let service = Container.get(UserService);
        let id = req.params.id;
        let result = await service.getOne(id)
        if(!result) throw new Boom("no user found with this id", {statusCode:404})

        return result
    }


    public async CreateUser(req: Request, h:ResponseToolkit<ReqRefDefaults>){
        let service : UserService = Container.get(UserService);
        let inputs : object
        if(typeof req.payload === 'string') throw new Boom("payload has to be an object", {statusCode: 400});
        else inputs = {...req.payload};
        let result = await service.createUser(inputs);
        if(!result || result.length<1){
            throw new Boom("No data found", {statusCode:404})
        }

        return result;
    }



    public async UpdateUser(req: Request, h:ResponseToolkit<ReqRefDefaults>){
        let service : UserService = Container.get(UserService);
        let inputs : object;
        if(typeof req.payload === 'string') throw new Boom("payload has to be an object", {statusCode: 400});
        else inputs = {...req.payload};

        return await service.updateUser(inputs, req.params.id)
    }
}
