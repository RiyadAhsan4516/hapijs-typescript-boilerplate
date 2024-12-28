// THIRD PARTY IMPORTS
import type {ReqRefDefaults, Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import {Inject, Service} from "typedi";

// LOCAL IMPORTS
import {AuthService} from "./authentication.service";
import {ResponseType} from "../../extensions";
import {sendEmail} from "../../helpers/email";
import {unauthorized} from "@hapi/boom";


@Service()
export class AuthController {

    constructor(
        @Inject(() => AuthService) private readonly service: AuthService,
    ) {
    }

    // FEATURE : USER LOGIN
    public async generalLogin(req: Request, h: ResponseType): Promise<ResponseObject> {
        // const service: AuthService = Container.get(AuthService);
        const {email, password}: any = req.payload;
        const result: { accessToken: string, refreshToken: string } = await this.service.validateLogin({
            email,
            password
        }, req.info.remoteAddress);

        // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
        let name: string = req.headers.origin?.split("://")[1].split(".")[0].concat(`-refresh`)

        // SET THE COOKIE WITH NECESSARY OPTIONS
        h.state(name, result.refreshToken, {
            encoding: 'none',
            isSecure: true,
            isHttpOnly: true,
            isSameSite: "None",
            ttl: 86400000,
            path: '/',
        })

        // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
        return h.success({
            message: "Login successful",
            token: `${result.accessToken}`
        }, 200)
    }


    // FEATURE : CHECK LOGGED IN USER
    public async isLoggedIn(decoded: any, req: Request, h: ResponseToolkit<ReqRefDefaults>): Promise<{
        isValid: boolean
    }> {
        let token: string = req.headers.authorization.split(" ")[1]
        return await this.service.validateTokenInfo(token);
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


    // FEATURE : TAKE REFRESH TOKEN
    public async refreshToken(req: Request, h: ResponseType): Promise<ResponseObject> {
        // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
        let name: string = req.headers.origin.split("://")[1].split(".")[0].concat("-refresh")

        if (!req.state[name]) throw unauthorized("no refresh token found")
        let payload: any = await this.service.refreshToken(req.state[name], req.info.remoteAddress)
        h.unstate(name, {path: '/'})
        h.state(name, payload.refreshToken, {
            encoding: 'none',
            isSecure: true,
            isHttpOnly: true,
            isSameSite: "None",
            ttl: 86400000,
            path: '/',
        })
        return h.success({token: payload.accessToken}, 200)
    }


    // FEATURE : LOGOUT USER
    public async logout(req: Request, h: ResponseType): Promise<ResponseObject> {

        // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
        let name: string = req.headers.origin.split("://")[1].split(".")[0].concat(`-refresh`)

        let access_token: string = req.headers.authorization.split(" ")[1]

        // CALL AUTH SERVICE AND LOGOUT THE USER
        const result: {
            accessToken: string,
            refreshToken: string
        } = await this.service.logoutUser(req.state[name], access_token);

        // SET THE COOKIE WITH NECESSARY OPTIONS
        h.unstate(name, {path: '/'})
        h.state(name, result.refreshToken, {encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None"})

        // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
        return h.success({
            message: "Logged out!",
            token: `${result.accessToken}`
        }, 200)
    }


    // FEATURE : FORGOT PASSWORD
    public async forgotPassword(req: Request, h: ResponseType): Promise<ResponseObject> {
        //@ts-ignore
        let {email} = req.payload
        // let service : AuthService = Container.get(AuthService)
        let result: any = await this.service.forgotPassword(email)

        let response: ResponseObject = await h.success({message: "recovery email sent"}, 200)

        // STEP 3 : SEND EMAIL, SET CODE IN THE EMAIL
        let options: any = {
            email: result.user.email,
            subject: 'Password Recovery',
            message: `Please use this code to recover your password : ${result.code} . Note that this code will expire within 5 minutes`
        }

        sendEmail(options).then()
            .catch((err: any) => console.log(err))

        // STEP 4 : SEND RESPONSE
        return response
    }

    public async recoveryToken(req: Request, h: ResponseType): Promise<ResponseObject> {
        //@ts-ignore
        let {code} = req.payload
        // let service : AuthService = Container.get(AuthService)
        let result: { accessToken: string } = await this.service.passwordRecoveryToken(code)

        // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
        return h.success({
            message: "code validated",
            token: `${result.accessToken}`
        }, 200)
    }

    public async resetPassword(req: Request, h: ResponseType): Promise<ResponseObject> {
        //@ts-ignore
        let {new_password, confirm_password} = req.payload
        let user_id: string = `${req.auth.credentials.id}`
        let result = await this.service.setNewPassword(new_password, confirm_password, user_id);
        return h.success(result, 200)
    }

}
