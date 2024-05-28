import {UserProfileService} from "./userProfile.service";
import {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from "@hapi/hapi";
import {Container, Service} from "typedi";
import {InsertResult} from "typeorm";
import {payloadFormatter} from "../../helpers/payloadFormatter";

@Service()
export class UserProfileController{

    async createProfile(req: Request, h:ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject>{
        let service : UserProfileService = Container.get(UserProfileService);
        // @ts-ignore
        const attributes : any = {...req.payload};
        let result : InsertResult =  await service.createUserProfile(attributes)
        return h.response(await payloadFormatter(result)).code(200)
    }

    // async getProfile(req: Request, h:ResponseToolkit<ReqRefDefaults>): Promise<void>{
    //     let id = +req.params.id;
    //     let result = await this.service.getUserProfile(id);
    //     if(result.errno || result.error){
    //         return next(result)
    //     }
    //     res.status(200).json({
    //         data: result
    //     })
    // }

    async getAllProfiles(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<any>{
        let service : UserProfileService = Container.get(UserProfileService);
        let result = await service.getProfiles();
        return h.response(result).code(200);
    }
}
