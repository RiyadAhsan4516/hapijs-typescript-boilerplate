import {client} from "../app";
import {type_validation} from "./customInterfaces";
import {join} from "path";
import {readFile} from "fs/promises";
import {sign} from "jsonwebtoken";


// NEEDED
export async function tokenInvalidator(token: string, expires_at: number): Promise<boolean> {      // CHECKED
    await client.set(token, "true")
    await client.expire(token, expires_at)

    return true
}

// NEEDED
export async function tokenRenew(user: any, ip: string): Promise<{ accessToken: string, refreshToken: string }> {

    const payload: type_validation.tokenFormat = {
        id: user.id,
        role: user.role_id.name,
        rateLimit: 100
    }

    let path : any = join(__dirname, '../', '../', 'private_key.pem')
    const privateKey: string = await readFile(path, 'utf8')

    let accessToken : string = sign(payload, privateKey, {
        expiresIn: "15m",
        algorithm: "RS256"
    })

    let refreshToken : string =  sign(payload, privateKey, {
        expiresIn: "1d",
        algorithm: "RS256"
    })


    return {accessToken, refreshToken}
}
