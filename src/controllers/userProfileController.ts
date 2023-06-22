import {UserProfileService} from "../services/userProfileServices";
import {ReqRefDefaults, Request, ResponseToolkit} from "@hapi/hapi";
import {Container, Service} from "typedi";
import {Boom} from "@hapi/boom";
import * as fs from "fs";

@Service()
export class UserProfileController{

    private service : UserProfileService


    async createProfile(req: Request, h:ResponseToolkit<ReqRefDefaults>){
        this.service = Container.get(UserProfileService);
        // @ts-ignore
        const attributes = {...req.payload};
        let result = await this.service.createUserProfile(attributes)
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
