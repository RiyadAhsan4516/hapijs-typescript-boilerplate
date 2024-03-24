// THIRD PARTY IMPORTS
import type {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import {Container, Service} from "typedi";
import {AES, enc} from "crypto-js";

// LOCAL IMPORTS
import {AuthService} from "./authentication.service";
import {type_validation} from "../../helpers/customValidations";
import {invalidateToken} from "../../helpers/tokenInvalidator";
import {unauthorized} from "@hapi/boom";
import {UserRepository} from "../userAccount/userAccount.repository";
import {User} from "../userAccount/userAccount.entity";
import {GenerateTokens} from "../../helpers/generateTokens";
import jwt from "jsonwebtoken";


@Service()
export class AuthController {

    // FEATURE : USER LOGIN
    public async provideSaltKey(req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<{ salt: string }> {
        let saltKey: string;
        req.query["key"] === "1" ? saltKey = "5425e523c30a45e504780e952d57ed15" : saltKey = 'b2aeffe655c33180cfdc4a949957cb5f'
        return {salt: saltKey}
    }

    public async saltLogin(req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<any> {
        const service: AuthService = Container.get(AuthService);
        //@ts-ignore
        const {data} = req.payload;

        // DECRYPT THE DATA AND EXTRACT THE EMAIL AND PASSWORD
        const bytes: CryptoJS.lib.WordArray = AES.decrypt(data, "5425e523c30a45e504780e952d57ed15");
        const originalData: type_validation.loginInfo = JSON.parse(bytes.toString(enc.Utf8));

        // SEND DECRYPTED DATA TO SERVICE TO COMPLETE VALIDATION.
        const result: type_validation.generatedTokens = await service.validateLogin(originalData);

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
            token: `Bearer ${result.accessToken}`
        }

    }

    public async generalLogin(req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
        const service: AuthService = Container.get(AuthService);
        const {email, password}: any = req.payload;
        const result: { accessToken: string, refreshToken: string } = await service.validateLogin({email, password});

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
    public async isLoggedIn(decoded: any, req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<{
        isValid: boolean
    }> {
        let token: string = req.headers.authorization.split(" ")[1]
        let url: string = `/api${req.url.href.split("api")[1]}`
        let method: string = req.method
        return await Container.get(AuthService).validateTokenInfo(decoded, token, url, method);
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
    public async refreshToken(req: Request, h: ResponseToolkit<ReqRefDefaults>) {

        // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
        let name = req.headers.origin.split("://")[1].split(".")[0].concat("-refresh")

        let token;
        if (!req.state[name]) throw unauthorized("you are not authorized to perform this action")
        else token = req.state[name];

        if (!token) throw unauthorized("you need to login again");

        // @ts-ignore
        const decoded: any = jwt.verify(token, process.env.SECRET);

        // Check if user with the id in the decoded token actually exists
        const user: User | null = await Container.get(UserRepository).getOneUser(decoded.id)
        if (!user) return unauthorized("the user of this token does not exist");

        // TODO: SET ROLE ID
        const payload: type_validation.tokenFormat = {
            id: user.id,
            role: user.id,
            rateLimit: 100
        }
        const accessToken: string = await Container.get(GenerateTokens).createToken(payload, "15m")
        const refreshToken: string = await Container.get(GenerateTokens).createToken(payload, "1d")

        h.state(name, refreshToken, {encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None"})

        return h.response({token: accessToken}).code(200)
    }


    // FEATURE : LOGOUT USER
    public async logout(req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {

        let user_id: string = `${req.auth.credentials.id}`
        let access_token: string = req.headers.authorization.split(" ")[1]

        // INVALIDATE THE ACCESS TOKEN AND SET THE EXPIRY TIME FOR 1 DAY
        await invalidateToken(access_token, user_id, "access")

        // CALL AUTH SERVICE AND LOGOUT THE USER
        const service: AuthService = Container.get(AuthService);
        const result: { accessToken: string, refreshToken: string } = await service.logoutUser();

        // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
        let name = req.headers.origin.split("://")[1].split(".")[0].concat(`-refresh`)

        // INVALIDATE THE PREVIOUSLY SET UP REFRESH TOKEN
        let refresh_token = req.state[name]
        if (refresh_token) await invalidateToken(refresh_token, user_id, "refresh")

        // SET THE COOKIE WITH NECESSARY OPTIONS
        h.state(name, result.refreshToken, {encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None"})

        // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
        return h.response({
            message: "Logged out!",
            token: `${result.accessToken}`
        }).unstate(name)
    }

}
