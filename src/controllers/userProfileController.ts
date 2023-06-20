import {UserProfileService} from "../services/userProfileServices";
import {ReqRefDefaults, Request, ResponseToolkit} from "@hapi/hapi";
import {Boom} from "@hapi/boom";
import * as fs from "fs";

export class UserProfileController{

    async createProfile(req: Request, h:ResponseToolkit<ReqRefDefaults>){
        let service = new UserProfileService();
        // @ts-ignore
        const attributes = {...req.payload};
        let result = await service.createUserProfile(attributes)
        return result
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
