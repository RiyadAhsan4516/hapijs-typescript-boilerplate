// Third party imports
import * as dotenv from "dotenv"
dotenv.config();
import {Server, ServerApplicationState} from "@hapi/hapi"
import {join} from "path";
import * as inert from "@hapi/inert";
import * as HapiJwt from "hapi-auth-jwt2";
import * as vision from "@hapi/vision";
import * as pino from "hapi-pino";
import * as static_auth from 'hapi-auth-bearer-token';
import {createClient} from "redis";
import {Container} from "typedi";
import {ReqRefDefaults, Request, ResponseToolkit} from "@hapi/hapi";
import * as hapi_rate_limitor from "hapi-rate-limitor";

// Local module imports
import {AuthController} from "./src/modules/authentication/authentication.controller";
import {eventHandlerPlugin} from "./src/helpers/customPlugins";

// Local routes imports
import routes from "./src/routes";
import {badRequest} from "@hapi/boom";
import {errorCatcher} from "./src/helpers/errorCatcher";
import fs from "fs/promises";



// ********************************************
// *                                          *
// *         CREATE REDIS CONNECTION          *
// *                                          *
// ********************************************
const client : any = createClient({url: `redis://default:${process.env.REDIS_PASSWORD}@127.0.0.1:6379/3`});
try{
    client.connect().then(()=>console.log("redis connected"));
}catch(err){
    console.log(err);
}




// ********************************************
// *                                          *
// *         CREATE SERVER INSTANCE           *
// *                                          *
// ********************************************

const server : Server<ServerApplicationState> = new Server({
    port: process.env.PORT,
    host: process.env.LOCALHOST,
    debug: false,
    routes: {
        files:{
            relativeTo: join(__dirname, 'public')
        },
        cors: {
            origin: ["*"],
            headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
            credentials: true,
            preflightStatusCode: 204
        }
    },
});


// ********************************************
// *                                          *
// *          SET UP PINO LOGGER              *
// *                                          *
// ********************************************

// MULTIPLE TARGETS CAN ALSO BE SET AT ONCE. IN THAT CASE THE TARGETS MUST BE AN ARRAY
let transport : any  = {        // THIS DATA IS STATIC SO ANY TYPE WILL DO NO HARM
    target : "pino/file",
    options: { destination: `${__dirname}/app.log`}
}



// ********************************************
// *                                          *
// *          SERVER INITIALIZER              *
// *                                          *
// ********************************************

const init = async () : Promise<Server<ServerApplicationState>> => {

    // CREATE CUSTOM EVENTS
    server.event("empty_temp")


    // REGISTER PLUGINS
    // @ts-ignore
    await server.register([
        {
            plugin: inert   // inert is a plugin used for serving static files
        },
        {
            plugin: HapiJwt // jwt plugin required for creating auth strategy. Look up authentication in hapi.js documentation
        },
        {
            plugin: static_auth // static token authentication
        },
        {
            plugin: vision  // a plugin used for rendering templates
        },
        {
            plugin: pino,    // request logger
            options: {
                transport,
                level: 'info',
                async: true,
            }
        },
        {
            plugin : hapi_rate_limitor,
            options: {
                redis: `redis://default:${process.env.REDIS_PASSWORD}@127.0.0.1:6379/0`,
                extensionPoint : 'onPostAuth',
                namespace : 'hapi-rate-limitor',
                max : 100,
                duration : 1000*60,
                enabled: true,
                userAttribute: 'id',
                userLimitAttribute: 'rateLimit'
            }
        },
        {
            plugin: eventHandlerPlugin,     // custom plugin for handling "empty_temp" event
            options:{
                Server : server
            }
        }
    ]);


    // EXTRACT THE KEY FOR IS LOGGED IN JWT VERIFICATION
    const privateKey: string = await fs.readFile("./private_key.pem", 'utf8')
    server.auth.strategy('jwt', 'jwt', {        // inject the auth strategy as jwt into the server
        key: privateKey,
        validate: Container.get(AuthController).isLoggedIn,      // the token will be decoded by the plugin automatically
        verifyOptions : {
            algorithms: ["RS256"]
        }
    })


    server.auth.strategy('static', 'bearer-access-token', {
        validate: Container.get(AuthController).staticTokenValidator
    })


    server.route({
        method: "GET",
        path: `/api/v1/file`,
        handler: errorCatcher(async function (req: Request, h: ResponseToolkit<ReqRefDefaults>) {
            // @ts-ignore
            let path: string = req.query["path"]
            if (!path) throw badRequest("file path not found in query")
            let root_path: string = join(__dirname)
            const distRegEx: RegExp = /dist/;
            let filepath: string
            if (distRegEx.test(root_path)) filepath = join(__dirname, '/..', '/..', 'public', path)
            else filepath = join(__dirname, '/..', 'public', path)
            return h.file(filepath, {confine: false}).header('Cache-Control', "public, max-age=3600")
        })
    });

    server.route(routes);
    return server
};



// ********************************************
// *                                          *
// *         SERVER START FUNCTION            *
// *                                          *
// ********************************************

const start = async (server:Server<ServerApplicationState>) : Promise<Server<ServerApplicationState>> =>{
    await server.start();
    return server
}

export {init, start, client}
