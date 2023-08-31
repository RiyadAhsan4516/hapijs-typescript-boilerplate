import type { ReqRefDefaults, Request, ResponseToolkit } from '@hapi/hapi';
import {AuthService} from "../services/authService";
import {Service, Container} from "typedi";

interface tokens{
    accessToken: string,
    refreshToken: string
}

@Service()
export class AuthController {

    public async login(req: Request, h:ResponseToolkit<ReqRefDefaults>): Promise<{message: string, token: string}>{
        const service: AuthService = Container.get(AuthService);
        const {email, password} : any = req.payload;
        const result: tokens  = await service.validateLogin(email, password);

        // SET THE COOKIE WITH NECESSARY OPTIONS
        h.state('refresh', result.refreshToken, {encoding:'none', isSecure: true, isHttpOnly: true, isSameSite: "None"})

        // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
        return {
            message: "Login successful",
            token: `Bearer ${result.accessToken}`
        }
    }

    public async isLoggedIn(decoded: any, req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<{isValid:boolean}>{
        return await Container.get(AuthService).validateTokenInfo(decoded);
    }

    public async staticTokenValidator(req:Request, token : string, h:ResponseToolkit<ReqRefDefaults>) : Promise<{isValid:boolean, credentials: {}}>{
        let result : {isValid:boolean, credentials: {}}
        token === process.env.STATIC ? result = {isValid : true, credentials: {}} : result = {isValid : false, credentials: {}}
        return result;
    }

}
