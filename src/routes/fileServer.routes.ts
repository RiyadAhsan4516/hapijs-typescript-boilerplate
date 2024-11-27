import {Request} from "@hapi/hapi";


export const fileServer = [
    {
        method: "GET",
        path: `/{path*}`,
        options: {
            cache: {
                expiresIn: 5 * 60 * 1000, // Cache for 5 minutes (in milliseconds)
                privacy: 'public',        // Cache should be public
            }
        },
        handler:{
            file: function(req : Request){
                return req.params.path
            }
        }
    }
]
