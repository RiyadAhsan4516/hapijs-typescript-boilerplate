// Third party imports
import * as dotenv from "dotenv"
dotenv.config();
import {Server, ServerApplicationState} from "@hapi/hapi"
import {join} from "path";
import * as inert from "@hapi/inert";
import * as HapiJwt from "hapi-auth-jwt2";
import * as HapiSwagger from "hapi-swagger";
import * as vision from "@hapi/vision";
import * as pino from "hapi-pino";
import * as static_auth from 'hapi-auth-bearer-token';
import {createClient} from "redis";
import {Container} from "typedi";
import {ReqRefDefaults, Request, ResponseToolkit} from "@hapi/hapi";
// @ts-ignore
import * as hapi_rate_limiter from "hapi-rate-limit";

// Local module imports
import {AuthController} from "./src/controllers/authController";
import {eventHandlerPlugin} from "./src/helpers/customPlugins";

// Local routes imports
import routes from "./src/routes";


// ********************************************
// *                                          *
// *       OPTIONAL: SET UP SWAGGER           *
// *                                          *
// ********************************************
const SwaggerFile = require("./assets/swagger.json")
const swaggerOptions : {} = {
    customSwaggerFile : SwaggerFile
}



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
            headers: ["Accept", "Content-Type"],
            credentials: true,
        }
    },
});


// ********************************************
// *                                          *
// *          SET UP PINO LOGGER              *
// *                                          *
// ********************************************

// MULTIPLE TARGETS CAN ALSO BE SET AT ONCE. IN THAT CASE THE TARGETS MUST BE AN ARRAY
let transport : any;
if(process.env.NODE_ENV === 'production') {
    transport = {
        target : "pino/file",
        options: { destination: `${__dirname}/app.log`}
    }
} else {
    transport = {
        target : '@logtail/pino',
        options: { sourceToken: process.env.LOGTAIL_TOKEN }
    }
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
            plugin: HapiSwagger,    // swagger api
            options: swaggerOptions
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
            plugin: hapi_rate_limiter,  // rate limiter for routes
            options:{
                enabled: true,
                userLimit: 100,
            }
        },
        {
            plugin: eventHandlerPlugin,     // custom plugin for handling "empty_temp" event
            options:{
                Server : server
            }
        }
    ]);


    server.auth.strategy('jwt', 'jwt', {        // inject the auth strategy as jwt into the server
        key: `${process.env.SECRET}`,
        validate: Container.get(AuthController).isLoggedIn      // the token will be decoded by the plugin automatically
    })


    server.auth.strategy('static', 'bearer-access-token', {
        validate: Container.get(AuthController).staticTokenValidator
    })


    server.route({
        method: 'GET',
        path: '/{picture}',
        handler: function (req :Request , h: ResponseToolkit<ReqRefDefaults>) {
            return h.file(`${req.params.picture}`);
        }
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
