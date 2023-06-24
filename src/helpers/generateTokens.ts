import jwt from "jsonwebtoken";
import {Service} from "typedi";

@Service()
export class GenerateTokens{
    public async createToken(payload: string | Buffer | object, expire: number | string){
        return jwt.sign(payload, `${process.env.SECRET}`, {
            expiresIn: expire,
        })
    }
}
