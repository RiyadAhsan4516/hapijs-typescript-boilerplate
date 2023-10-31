import {UserProfileService} from "../services/userProfileServices";
import {ReqRefDefaults, Request, ResponseToolkit} from "@hapi/hapi";
import {Container, Service} from "typedi";
import {methodTypeCheck} from "../helpers/errorChecker";

@Service()
export class UserProfileController{

    private service : UserProfileService

    async createProfile(req: Request, h:ResponseToolkit<ReqRefDefaults>){
        let service : UserProfileService = Container.get(UserProfileService);
        // @ts-ignore
        const attributes : any = {...req.payload};
        return await this.service.createUserProfile(attributes)
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
        // CHECK REQUEST METHOD TYPE
        methodTypeCheck(req.method, 'get')

        let service : UserProfileService = Container.get(UserProfileService);
        let result = await service.getProfiles();
        return h.response(result).code(200);
    }
}
