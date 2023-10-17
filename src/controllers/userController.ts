import type {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import {Container, Service} from "typedi";
import { UserService } from "../services/userService"
import {User} from "../entities/userEntity";
import * as Boom from "@hapi/boom";

@Service()
export class UserController{

    public async getUsers(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<User[]|ResponseObject>{
        let service : UserService = Container.get(UserService);
        let result : User[] = await service.getAll()
        if(!result || result.length<1) return h.response("No data found").code(204)
        return result
    }

    public async getUser(req: Request, h:ResponseToolkit<ReqRefDefaults>): Promise<User|ResponseObject>{
        let service : UserService = Container.get(UserService);
        let id = req.params.id;
        let result : User | null = await service.getOne(id)
        if(!result) return h.response("No user found with this id").code(204)

        return result
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
