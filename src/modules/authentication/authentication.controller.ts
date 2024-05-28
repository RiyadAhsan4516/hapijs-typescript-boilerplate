// THIRD PARTY IMPORTS
import type {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import {Container, Service} from "typedi";
import {AES, enc} from "crypto-js";

// LOCAL IMPORTS
import {AuthService} from "./authentication.service";
import {type_validation} from "../../helpers/customInterfaces";


@Service()
export class AuthController {

    // FEATURE : USER LOGIN
    public async provideSaltKey(req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
        let saltKey: string;
        req.query["key"] === "1" ? saltKey = "5425e523c30a45e504780e952d57ed15" : saltKey = 'b2aeffe655c33180cfdc4a949957cb5f'
        return h.response({salt: saltKey}).code(200)
    }

    public async saltLogin(req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<any> {
        const service: AuthService = Container.get(AuthService);
        //@ts-ignore
        const {data} = req.payload;

        // DECRYPT THE DATA AND EXTRACT THE EMAIL AND PASSWORD
        const bytes: CryptoJS.lib.WordArray = AES.decrypt(data, "5425e523c30a45e504780e952d57ed15");
        const originalData: type_validation.loginInfo = JSON.parse(bytes.toString(enc.Utf8));

        // SEND DECRYPTED DATA TO SERVICE TO COMPLETE VALIDATION.
        const result: type_validation.generatedTokens = await service.validateLogin(originalData, req.info.remoteAddress);

        // SET THE COOKIE WITH NECESSARY OPTIONS
        h.state('refresh', result.refreshToken, {
            encoding: 'none',
            isSecure: true,
            isHttpOnly: true,
            isSameSite: "None"
        })

        // ENCRYPT THE ACCESS TOKEN
        let accessToken: string = AES.encrypt(result.accessToken, 'b2aeffe655c33180cfdc4a949957cb5f').toString()

        // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
        return {
            message: "Login successful",
            token: `Bearer ${accessToken}`
        }

    }

    public async generalLogin(req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
        const service: AuthService = Container.get(AuthService);
        const {email, password}: any = req.payload;
        const result: { accessToken: string, refreshToken: string } = await service.validateLogin({email, password}, req.info.remoteAddress);

        // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
        let name: string = req.headers.origin?.split("://")[1].split(".")[0].concat(`-refresh`)

        // SET THE COOKIE WITH NECESSARY OPTIONS
        h.state(name, result.refreshToken, {encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None"})

        // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
        return h.response({
            message: "Login successful",
            token: `${result.accessToken}`
        }).code(200)
    }


    // FEATURE : CHECK LOGGED IN USER
    public async isLoggedIn(decoded: any, req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<{ isValid: boolean }> {
        let token: string = req.headers.authorization.split(" ")[1]
        let url: string = `/api${req.url.href.split("api")[1]}`
        let method: string = req.method
        return await Container.get(AuthService).validateTokenInfo(decoded, token, url, method, req.info.remoteAddress);
    }


    public async staticTokenValidator(req: Request, token: string, h: ResponseToolkit<ReqRefDefaults>): Promise<{
        isValid: boolean,
        credentials: {}
    }> {
        let result: { isValid: boolean, credentials: {} }
        token === process.env.STATIC ? result = {isValid: true, credentials: {}} : result = {
            isValid: false,
            credentials: {}
        }
        return result
    }


    // FEATURE: TAKE REFRESH TOKEN
    public async refreshToken(req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
        let service: AuthService = Container.get(AuthService)
        // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
        let name : string = req.headers.origin.split("://")[1].split(".")[0].concat("-refresh")
        let payload : any = await service.refreshToken(req.state[name], req.info.remoteAddress)
        h.state(name, payload.refreshToken, {encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None"})
        return h.response({token: payload.accessToken}).code(200)
    }


    // FEATURE : LOGOUT USER
    public async logout(req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {

        let user_id: string = `${req.auth.credentials.id}`
        // let access_token: string = req.headers.authorization.split(" ")[1]

        // CALL AUTH SERVICE AND LOGOUT THE USER
        const service: AuthService = Container.get(AuthService);
        const result: { accessToken: string, refreshToken: string } = await service.logoutUser(user_id, req.info.remoteAddress);

        // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
        let name : string = req.headers.origin.split("://")[1].split(".")[0].concat(`-refresh`)

        // SET THE COOKIE WITH NECESSARY OPTIONS
        h.state(name, result.refreshToken, {encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None"})

        // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
        return h.response({
            message: "Logged out!",
            token: `${result.accessToken}`
        }).unstate(name)
    }

}
