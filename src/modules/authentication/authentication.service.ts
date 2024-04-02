// THIRD PARTY IMPORTS
import {Container, Service} from "typedi";
import {compare} from "bcryptjs";
import {badData, forbidden, unauthorized} from "@hapi/boom";

// LOCAL IMPORTS
import {UserRepository} from "../userAccount/userAccount.repository";
import {User} from "../userAccount/userAccount.entity";
import {type_validation} from "../../helpers/customInterfaces";
import {client} from "../../../app";
import {tokenInvalidator, tokenRenew} from "../../helpers/tokenCache";
import fs from "fs/promises";
import jwt, {VerifyErrors} from "jsonwebtoken";


@Service()
export class AuthService {

    public async logoutUser(user_id: string, ip: string) {

        // INVALIDATE THE TOKENS (NEW FORMAT)
        await tokenInvalidator(+user_id, ip)

        return {
            accessToken: "",
            refreshToken: ""
        }
    }

    public async validateLogin(originalData: any, ip: string): Promise<{ accessToken: string, refreshToken: string }> {

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

        // RETURN THE GENERATED ACCESS AND REFRESH TOKEN
        return await tokenRenew(user, ip)

    }

    public async validateTokenInfo(decoded: any, token: string, url: string, method: string, ip: string): Promise<{
        isValid: boolean
    }> {
        const user: User | null = await Container.get(UserRepository).getOneUser(decoded.id);
        let role: string

        let blacklisted_tokens = JSON.parse(await client.hGet(`blacklist-${decoded.id}`, ip))
        if (blacklisted_tokens) {
            if (blacklisted_tokens.includes(token)) return {isValid: false}
        }

        if (!user) return {isValid: false}
        else return {isValid: true}
    }

    public async refreshToken(refresh_token: string | null, ip: string): Promise<{
        accessToken: string,
        refreshToken: string
    }> {
        let token;
        if (!refresh_token) throw unauthorized("you are not authorized to perform this action")
        else token = refresh_token;

        if (!token) throw unauthorized("you need to login again");

        // VERIFY TOKEN USING RS256 PUBLIC KEY
        let cert: string = await fs.readFile("./../../../public_key.pem", "utf8")
        let decoded: any
        await jwt.verify(token, cert, (err: VerifyErrors | null, decode: any): void => {
            if (!err) decoded = decode
            else throw forbidden("you are not authorized to perform this action")
        });

        // CHECK IF USER WITH THIS ID FOUND FROM DECODING ACTUALLY EXISTS
        const user: User | null = await Container.get(UserRepository).getOneUser(decoded.id)
        if (!user) throw unauthorized("the user of this token does not exist");

        // INVALIDATE THE PREVIOUS TOKENS HERE
        await tokenInvalidator(user.id, ip)

        // CREATE AND RETURN NEW TOKENS
        return await tokenRenew(user, ip)
    }

}
