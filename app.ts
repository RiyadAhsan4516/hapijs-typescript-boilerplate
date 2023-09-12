import * as dotenv from "dotenv"
dotenv.config();

import * as Hapi from "@hapi/hapi"
import * as path from "path";
import * as inert from "@hapi/inert";
import * as HapiJwt from "hapi-auth-jwt2";
import * as HapiSwagger from "hapi-swagger";
import * as vision from "@hapi/vision";
import * as pino from "hapi-pino";
import * as static_auth from 'hapi-auth-bearer-token';
import * as redis from "redis";

import {Container} from "typedi";
import {ReqRefDefaults, Request, ResponseToolkit} from "@hapi/hapi";

import {AuthController} from "./src/controllers/authController";
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
const client : any = redis.createClient({url: 'redis://127.0.0.1:6379/3'});
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

const server : Hapi.Server<Hapi.ServerApplicationState> = Hapi.server({
    port: process.env.PORT,
    host: process.env.LOCALHOST,
    debug: false,
    routes: {
        files:{
            relativeTo: path.join(__dirname, 'public')
        },
        cors: {
            origin: ["*"],
            headers: ["Accept", "Content-Type"],
            additionalHeaders: ["X-Requested-With"]
        }
    }
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

const init = async () : Promise<Hapi.Server<Hapi.ServerApplicationState>> => {

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
        }, /// test
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

const start = async (server:Hapi.Server<Hapi.ServerApplicationState>) : Promise<Hapi.Server<Hapi.ServerApplicationState>> =>{
    await server.start();
    return server
}

export {init, start, client}
