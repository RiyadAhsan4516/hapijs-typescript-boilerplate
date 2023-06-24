import type { ReqRefDefaults, Request, ResponseToolkit } from '@hapi/hapi';
import {AuthService} from "../services/authService";
import {Service, Container} from "typedi";

interface tokens{
    accessToken: string,
    refreshToken: string
}

@Service()
export class Authenticator{

    public async login(req: Request, h:ResponseToolkit<ReqRefDefaults>): Promise<{message: string, token: string}>{
        const service: AuthService = Container.get(AuthService);
        // @ts-ignore
        const {email, password} = req.payload;
        const result: tokens  = await service.validateExistence(email, password);

        // SET THE COOKIE WITH NECESSARY OPTIONS
        h.state('jwt', result.refreshToken, {encoding:'none', isSecure: true, isHttpOnly: true, isSameSite: "None"})

        // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
        return {
            message: "Login successful",
            token: `Bearer ${result.accessToken}`
        }
    }

    public async isLoggedIn(decoded: any, req: Request, h:ResponseToolkit<ReqRefDefaults>){
        // FINISH THE FUNCTION
    }

}
