import {client} from "../../app";
import {forbidden} from "@hapi/boom";
import {type_validation} from "./customInterfaces";
import {Container} from "typedi";
import {GenerateTokens} from "./generateTokens";

interface tokenTypes {
    access : string,
    refresh: string
}

export async function tokenSetup(tokens : tokenTypes, user_id: number, ip : string){
    let payload : any = {
        access : {
            token : tokens.access,
            status : true
        },
        refresh : {
            token : tokens.refresh,
            status : true
        }
    }
    await client.hSet(`tokens-${user_id}`, ip, JSON.stringify(payload))
    await client.expire(`tokens-${user_id}`, 24*60*60)
}

export async function tokenInvalidator(user_id: number, ip : string){
    let cached_tokens : any = JSON.parse(await client.hGet(`tokens-${user_id}`, ip))
    if(!cached_tokens) throw forbidden("You are not authorized to perform this action")

    let token_list: string[] = [cached_tokens.access.token, cached_tokens.refresh.token]
    let invalid_tokens = JSON.parse(await client.hGet(`blacklist-${user_id}`, ip))
    if (invalid_tokens && invalid_tokens.length>0) {
        token_list = [...token_list, ...invalid_tokens]
    }

    await client.hSet(`blacklist-${user_id}`, ip, JSON.stringify(token_list))
    await client.expire(`blacklist-${user_id}`, 24*60*60)
}

export async function tokenRenew(user : any, ip : string) : Promise<{accessToken : string, refreshToken : string}>{
    const payload: type_validation.tokenFormat = {
        id: user.id,
        role: user.role_id.id,
        rateLimit: 100
    }
    const accessToken: string = await Container.get(GenerateTokens).createToken(payload, "15m")
    const refreshToken: string = await Container.get(GenerateTokens).createToken(payload, "1d")

    // SET UP NEW TOKENS IN REDIS
    await tokenSetup({access: accessToken, refresh: refreshToken}, user.id, ip)

    return {accessToken, refreshToken}
}
