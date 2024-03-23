// THIRD PARTY IMPORTS
import {Service, Container} from "typedi";
import {compare} from "bcryptjs";
import {badData, unauthorized} from "@hapi/boom";

// LOCAL IMPORTS
import {UserRepository} from "../userAccount/userAccount.repository";
import {GenerateTokens} from "../helpers/generateTokens";
import {User} from "../userAccount/userAccount.entity";
import {type_validation} from "../helpers/customValidations";
import {client} from "../../app";
import {authorize} from "../authorization/authorization.access";


@Service()
export class AuthService{

    public async logoutUser(){
        return {
            accessToken : "",
            refreshToken : ""
        }
    }

    public async validateLogin(originalData : any) : Promise<{accessToken: string, refreshToken: string}>{

        // SET UP INPUT VALIDATION ON ORIGINAL DATA
        let validationCheck: type_validation.loginInfoJoiValidation = await new type_validation.loginInfoJoiValidation;
        let validation_result = await validationCheck.check(originalData);
        if (validation_result.error) throw badData(validation_result.error.details[0].message);

        // "SELECT" OPTION FOR PASSWORD IN USER ENTITY IS SET TO FALSE. CALL A SEPARATE QUERY TO FIND THE USER ALONG WITH THE PASSWORD
        const user: User | null = await Container.get(UserRepository).getUserWithPassword(originalData.email)

        // THROW ERROR IF NO USER IS FOUND
        if (!user || !(await compare(originalData.password, user.password))) {
            throw unauthorized("email or password invalid")
        }

        // TOKEN GENERATION PAYLOAD
        const payload: type_validation.tokenFormat = {
            id: user.id,
            role: user.id,
            rateLimit: 100
        }

        // GENERATE AN ACCESS TOKEN
        const accessToken: string = await Container.get(GenerateTokens).createToken(payload, "15m")

        // GENERATE A REFRESH TOKEN
        const refreshToken: string = await Container.get(GenerateTokens).createToken(payload, "1d")

        // RETURN THE GENERATED ACCESS AND REFRESH TOKEN
        return {accessToken, refreshToken}

    }

    public async validateTokenInfo(decoded: any, token : string, url : string, method: string): Promise<{ isValid: boolean }> {
        const user: User | null = await Container.get(UserRepository).getOneUser(decoded.id);
        let role : string

        // TODO: SET ROLE HERE
        user? role = user.email : role = ""

        await authorize(role, url, method)

        let access_tokens  = JSON.parse(await client.hGet(`tokens-${decoded.id}`, "access"))
        let refresh_tokens = JSON.parse(await client.hGet(`tokens-${decoded.id}`, "refresh"))
        if(access_tokens){
            if(access_tokens.tokens && access_tokens.tokens.includes(token)) return {isValid: false}
            if(refresh_tokens && refresh_tokens.tokens && refresh_tokens.tokens.includes(token)) return {isValid: false}
        }

        if (!user) return {isValid: false}
        else return {isValid: true}
    }

}
