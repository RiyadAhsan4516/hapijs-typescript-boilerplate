import {sign} from "jsonwebtoken";
import {Service} from "typedi";
import {readFile} from "fs/promises";
import {join} from "path"

@Service()
export class GenerateTokens{
    public async createToken(payload: string | Buffer | object, expire: number | string){
        let path : any = join(__dirname, '../', '../', 'private_key.pem')
        const privateKey: string = await readFile(path, 'utf8')
        return sign(payload, privateKey, {
            expiresIn: expire,
            algorithm: "RS256"
        })
    }
}
