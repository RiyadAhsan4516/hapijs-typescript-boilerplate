import {RouteOptionsPayload} from "@hapi/hapi";

export function multipartConfig (size : number, timeout: number) : RouteOptionsPayload {
    return {
        allow: "multipart/form-data",
        parse: true,
        multipart: {
            output: "file"
        },
        maxBytes: 1000 * 1000 * size, // In MB
        timeout,
        uploads: 'public/tmp',
    }
}
