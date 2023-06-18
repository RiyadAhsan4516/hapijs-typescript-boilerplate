import {UserProfileService} from "../services/userProfileServices";
import {ReqRefDefaults, Request, ResponseToolkit} from "@hapi/hapi";
import {Boom} from "@hapi/boom";
import * as fs from "fs";


let service : UserProfileService;

export class UserProfileController{

    constructor(){
        service = new UserProfileService()
    }

    async createProfile(req: Request, h:ResponseToolkit<ReqRefDefaults>){
        // @ts-ignore
        const attributes = {...req.payload};
        console.log(attributes.name)
        return "hello"
    }

    // async getProfile(req: Request, h:ResponseToolkit<ReqRefDefaults>): Promise<void>{
    //     let id = +req.params.id;
    //     let result = await service.getUserProfile(id);
    //     if(result.errno || result.error){
    //         return next(result)
    //     }
    //     res.status(200).json({
    //         data: result
    //     })
    // }
    //
    // async getAllProfiles(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<void>{
    //     const result = await service.getProfiles();
    //     res.status(200).json({
    //         data : result
    //     })
    // }
}
