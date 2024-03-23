import {client} from "../../app";

export async function invalidateToken(token: string, user_id: string, token_type: string){
    let token_list: string[] = [token]
    let invalid_tokens = JSON.parse(await client.hGet(`tokens-${user_id}`, "access"))
    if (invalid_tokens && invalid_tokens.tokens) {
        let tokenArray: any = invalid_tokens.tokens
        token_list = [...token_list, ...tokenArray]
    }
    await client.hSet(`tokens-${user_id}`, token_type, JSON.stringify({tokens: token_list}))
    await client.expire(`tokens-${user_id}`, 24 * 60 * 60)
}
