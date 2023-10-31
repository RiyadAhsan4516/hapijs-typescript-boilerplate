import {gzip} from "zlib";

export async function payloadCompressor(data : any[]) : Promise<Buffer>{
    return await new Promise((resolve, reject) : void=>{
        gzip(JSON.stringify(data), (error : Error | null, compressed : Buffer) : void=>{
            error? reject(error) : resolve(compressed)
        })
    })
}
