import {Service, Container} from "typedi";
import * as Boom from "@hapi/boom";
import bcrypt from "bcryptjs";
import {UserRepository} from "../repositories/userRepository";
import {GenerateTokens} from "../helpers/generateTokens";
import {User} from "../entities/userEntity";

interface token{
    id: number,
    type: string
}
@Service()
export class AuthService{

    public async validateLogin(email : string, password: string) : Promise<{accessToken: string, refreshToken: string}>{

        // "SELECT" OPTION FOR PASSWORD IN USER ENTITY IS SET TO FALSE. CALL A SEPARATE QUERY TO FIND THE USER ALONG WITH THE PASSWORD
        const user : User | null = await Container.get(UserRepository).getUserWithPassword(email)

        // THROW ERROR IF NO USER IS FOUND
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw Boom.unauthorized("email or password invalid")
        }

        // GENERATE AN ACCESS TOKEN WITH TYPE 'ACCESS'
        const payload : token = {
            id: user.id,
            type: 'access'
        }
        const accessToken: string = await Container.get(GenerateTokens).createToken(payload, "15m")

        // GENERATE A REFRESH TOKEN WITH TYPE 'REFRESH'
        payload.type = "refresh"
        const refreshToken: string = await Container.get(GenerateTokens).createToken(payload, "1d")

        // RETURN THE GENERATED ACCESS AND REFRESH TOKEN
        return {accessToken, refreshToken}

    }

    public async validateTokenInfo(decoded: any) : Promise<{isValid: boolean}>{
        const user : User | null = await Container.get(UserRepository).getOneUser(decoded.id);

        if(!user) return {isValid: false}
        else return {isValid: true}
    }
}
