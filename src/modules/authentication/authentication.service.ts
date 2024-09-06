// THIRD PARTY IMPORTS
import {Inject, Service} from "typedi";
import {compare} from "bcryptjs";
import {badData, badRequest, forbidden, unauthorized} from "@hapi/boom";

// LOCAL IMPORTS
import {type_validation} from "../../helpers/customInterfaces";
import {client} from "../../app";
import {tokenInvalidator, tokenRenew} from "../../helpers/tokenCache";
import fs from "fs/promises";
import jwt, {VerifyErrors} from "jsonwebtoken";
import path from "path";
import moment from "moment";
import {GenerateTokens} from "../../helpers/generateTokens";
import {AuthTokensRepository} from "./authTokens.repository";
import {AuthTokensEntity} from "./authTokens.entity";
import {UserAccountRepository} from "../userAccount/userAccount.repository";
import {UserAccountEntity} from "../userAccount/userAccount.entity";


@Service()
export class AuthService {

    constructor(
        @Inject() private userRepository: UserAccountRepository,
        @Inject() private authTokenRepo: AuthTokensRepository,
        @Inject() private generateTokenRepo : GenerateTokens
    ) {
    }

    public async logoutUser(refresh_token: string, access_token: string) {

        // SEARCH THE DATABASE FOR THE ACCESS TOKEN USING THE REFRESH TOKEN
        let tokens: AuthTokensEntity | null = await this.authTokenRepo.getUsingRefresh(refresh_token)

        // INVALIDATE THE TOKEN WITH EXPIRATION TIME
        let refresh_expires = moment(tokens?.refresh_expires_at).diff(moment(), 'seconds');
        let access_expires = moment(tokens?.access_expires_at).diff(moment(), 'seconds');

        // INVALIDATE THE REFRESH TOKEN
        await tokenInvalidator(refresh_token, refresh_expires)

        // NOW INVALIDATE THE ACCESS TOKEN
        await tokenInvalidator(access_token, access_expires)

        // DELETE THE TOKEN USING ID
        await this.authTokenRepo.delete(`${tokens?.id}`)

        return {
            accessToken: "",
            refreshToken: ""
        }
    }

    public async validateLogin(originalData: any, ip: string): Promise<{ accessToken: string, refreshToken: string }> {

        // SET UP INPUT VALIDATION ON ORIGINAL DATA
        let validationCheck: type_validation.loginInfoJoiValidation = new type_validation.loginInfoJoiValidation;
        let validation_result = await validationCheck.check(originalData);
        if (validation_result.error) throw badData(validation_result.error.details[0].message);

        // "SELECT" OPTION FOR PASSWORD IN USER ENTITY IS SET TO FALSE. CALL A SEPARATE QUERY TO FIND THE USER ALONG WITH THE PASSWORD
        const user: UserAccountEntity | null = await this.userRepository.getUserWithPassword(originalData.email)

        // THROW ERROR IF NO USER IS FOUND
        if (!user || !(await compare(originalData.password, user.password))) {
            throw unauthorized("email or password invalid")
        }

        // RETURN THE GENERATED ACCESS AND REFRESH TOKEN
        let result: { accessToken: string, refreshToken: string } = await tokenRenew(user, ip)

        // SET THE ACCESS AND REFRESH TOKEN IN DATABASE
        let payload: any = {
            user_id: user.id,
            refresh_token: result.refreshToken,
            access_token: result.accessToken,
            refresh_expires_at: moment().add(1, 'days').toISOString(),
            access_expires_at: moment().add(15, 'minutes').toISOString()
        }
        await this.authTokenRepo.create(payload)
        return result
    }

    public async validateTokenInfo(token: string): Promise<{
        isValid: boolean
    }> {

        let validated = await client.get(token)

        console.log("validated => ", validated)

        if (!validated) return {isValid: true}
        else return {isValid: false}
    }

    public async refreshToken(token: string, ip: string): Promise<{
        accessToken: string,
        refreshToken: string
    }> {
        let cert_path: string = path.join(__dirname, '../../../public_key.pem');
        let cert: string = await fs.readFile(cert_path, "utf8")
        let decoded: any
        jwt.verify(token, cert, (err: VerifyErrors | null, decode: any): void => {
            if (!err) decoded = decode
            else throw forbidden("token validation failed")
        })

        // CHECK IF THE REFRESH TOKEN HAS BEEN BLACKLISTED
        let boolean = await this.validateTokenInfo(token);
        if (!boolean.isValid) throw unauthorized("You need to login again")

        // CHECK IF USER WITH THIS ID FOUND FROM DECODING ACTUALLY EXISTS
        const user: UserAccountEntity | null = await this.userRepository.getOneUser(decoded.id)
        if (!user) throw unauthorized("the user of this token does not exist");

        // INVALIDATE THE PREVIOUS ACCESS TOKEN HERE
        let prev_refresh = await this.authTokenRepo.getUsingRefresh(token)

        // CREATE AND RETURN NEW TOKENS
        let new_tokens = await tokenRenew(user, ip)

        if(new_tokens.accessToken != prev_refresh.access_token){
            // INVALIDATE ACCESS TOKEN
            await tokenInvalidator(prev_refresh.access_token, moment(prev_refresh.access_expires_at).diff(moment(), 'seconds'))
        }

        // UPDATE THE DATABASE WITH NEW ACCESS TOKEN
        await this.authTokenRepo.updateUsingRefresh({
            access_token: new_tokens.accessToken,
            access_expires_at: moment().add(15, 'minutes').toISOString(),
        }, token)


        return {accessToken: new_tokens.accessToken, refreshToken: token}
    }


    // FEATURE : FORGOT PASSWORD SERVICES

    public async forgotPassword(email: string) {

        // STEP 1 : GET USER
        const user: UserAccountEntity | null = await this.userRepository.getUserWithEmail(email);
        if (!user) throw unauthorized("No user found with this email. Please register")

        // STEP 2 : IF USER EXISTS, CREATE CODE AND EXPIRATION TIME
        let code: string = `${Math.floor(100000 + Math.random() * 900000)}`;
        let expiration_time: any = moment().add(5, 'minutes');
        expiration_time = expiration_time.toISOString()
        await this.userRepository.setRecoveryCode(code, expiration_time, `${user.id}`);

        return {user, code}
    }

    public async passwordRecoveryToken(code: string) {
        const user: UserAccountEntity = await this.userRepository.getUserWithCode(code)
        if (!user) throw unauthorized()

        // CHECK EXPIRATION TIME
        let received_time = moment(user.reset_code_expired_at)
        const currentTime = moment();
        const isTimeReached = currentTime.isSameOrAfter(received_time);

        if (isTimeReached) throw badRequest("Your 5 minutes is over")

        // GENERATE AND RETURN AN ACCESS TOKEN
        const token_payload: type_validation.tokenFormat = {
            id: +user.id,
            role: `${user.role_id.id}`,
            rateLimit: 100
        }
        const accessToken: string = await this.generateTokenRepo.createToken(token_payload, "2m")

        return {accessToken}
    }

    public async setNewPassword(new_password: string, confirm_password: string, id: string) {
        if (new_password !== confirm_password) throw badRequest("passwords do not match")
        return await this.userRepository.resetPassword(new_password, id)
    }

}
