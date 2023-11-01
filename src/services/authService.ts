// THIRD PARTY IMPORTS
import {Service, Container} from "typedi";
import {compare} from "bcryptjs";
import {badData, unauthorized} from "@hapi/boom";

// LOCAL IMPORTS
import {UserRepository} from "../repositories/userRepository";
import {GenerateTokens} from "../helpers/generateTokens";
import {User} from "../entities/userEntity";
import {type_validation} from "../helpers/customValidations";


@Service()
export class AuthService{

    public async validateLogin(originalData : any) : Promise<{accessToken: string, refreshToken: string}>{

        // SET UP INPUT VALIDATION ON ORIGINAL DATA
        let validationCheck : type_validation.loginInfoJoiValidation = await new type_validation.loginInfoJoiValidation;
        let validation_result = await validationCheck.check(originalData);
        if(validation_result.error) throw badData(validation_result.error.details[0].message);

        // "SELECT" OPTION FOR PASSWORD IN USER ENTITY IS SET TO FALSE. CALL A SEPARATE QUERY TO FIND THE USER ALONG WITH THE PASSWORD
        const user : User | null = await Container.get(UserRepository).getUserWithPassword(originalData.email)

        // THROW ERROR IF NO USER IS FOUND
        if (!user || !(await compare(originalData.password, user.password))) {
            throw unauthorized("email or password invalid")
        }

        // GENERATE AN ACCESS TOKEN WITH TYPE SET TO 'access'
        const payload : type_validation.tokenFormat = {
            id: user.id,
            type: 'access'
        }
        const accessToken: string = await Container.get(GenerateTokens).createToken(payload, "15m")

        // GENERATE A REFRESH TOKEN WITH TYPE SET TO 'refresh'
        payload.type = "refresh"
        const refreshToken: string = await Container.get(GenerateTokens).createToken(payload, "1d")

        // TODO: SET THE TOKENS IN REDIS ALONG WITH USER ID

        // RETURN THE GENERATED ACCESS AND REFRESH TOKEN
        return {accessToken, refreshToken}

    }

    public async validateTokenInfo(decoded: any) : Promise<{isValid: boolean}>{
        const user : User | null = await Container.get(UserRepository).getOneUser(decoded.id);

        if(!user) return {isValid: false}
        else return {isValid: true}
    }

}
