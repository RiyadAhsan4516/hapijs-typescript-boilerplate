// THIRD PARTY IMPORTS
import type { ReqRefDefaults, Request, ResponseToolkit } from '@hapi/hapi';
import {Service, Container} from "typedi";
import {AES, enc} from "crypto-js";

// LOCAL IMPORTS
import {AuthService} from "../services/authService";
import {methodTypeCheck} from "../helpers/errorChecker";
import {type_validation} from "../helpers/customValidations";


@Service()
export class AuthController {

    public async provideSaltKey(req: Request, h:ResponseToolkit<ReqRefDefaults>) : Promise<{salt: string}>{
        methodTypeCheck(req.method, 'get');
        let saltKey: string;
        req.query["key"]==="1" ? saltKey = "5425e523c30a45e504780e952d57ed15" : saltKey = 'b2aeffe655c33180cfdc4a949957cb5f'
        return {salt: saltKey}
    }

    public async saltLogin(req: Request, h: ResponseToolkit<ReqRefDefaults>) : Promise<any>{
        const service: AuthService = Container.get(AuthService);
        //@ts-ignore
        const {data} = req.payload;

        // DECRYPT THE DATA AND EXTRACT THE EMAIL AND PASSWORD
        const bytes : CryptoJS.lib.WordArray  = AES.decrypt(data, "5425e523c30a45e504780e952d57ed15");
        const originalData : type_validation.loginInfo = JSON.parse(bytes.toString(enc.Utf8));

        // SEND DECRYPTED DATA TO SERVICE TO COMPLETE VALIDATION.
        const result : type_validation.generatedTokens = await service.validateLogin(originalData);

        // SET THE COOKIE WITH NECESSARY OPTIONS
        h.state('refresh', result.refreshToken, {encoding:'none', isSecure: true, isHttpOnly: true, isSameSite: "None"})

        // ENCRYPT THE ACCESS TOKEN
        let accessToken : string = AES.encrypt(result.accessToken, 'b2aeffe655c33180cfdc4a949957cb5f').toString()

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

    // public async generalLogin(req: Request, h:ResponseToolkit<ReqRefDefaults>): Promise<{message: string, token: string}>{
    //     const service: AuthService = Container.get(AuthService);
    //     const {email, password} : any = req.payload;
    //     const result: type_validation.tokens  = await service.validateLogin(email, password);
    //
    //     // SET THE COOKIE WITH NECESSARY OPTIONS
    //     h.state('refresh', result.refreshToken, {encoding:'none', isSecure: true, isHttpOnly: true, isSameSite: "None"})
    //
    //     // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
    //     return {
    //         message: "Login successful",
    //         token: `Bearer ${result.accessToken}`
    //     }
    // }

}
