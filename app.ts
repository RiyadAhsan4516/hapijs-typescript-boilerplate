import * as dotenv from "dotenv"
dotenv.config();

import * as Hapi from "@hapi/hapi"
import * as path from "path";
import * as inert from "@hapi/inert";
import * as HapiJwt from "hapi-auth-jwt2";
import * as HapiSwagger from "hapi-swagger";
import * as vision from "@hapi/vision";
import * as pino from "hapi-pino";
import {AuthController} from "./src/controllers/authController";
import {Container} from "typedi";
import {ReqRefDefaults, Request, ResponseToolkit} from "@hapi/hapi";
import routes from "./src/routes";

const SwaggerFile = require("./assets/swagger.json")

const swaggerOptions : {} = {
    customSwaggerFile : SwaggerFile
}


// ********************************************
// *                                          *
// *         CREATE SERVER INSTANCE           *
// *                                          *
// ********************************************

const server : Hapi.Server<Hapi.ServerApplicationState> = Hapi.server({
    port: process.env.PORT,
    host: process.env.LOCALHOST,
    routes: {
        files:{
            relativeTo: path.join(__dirname, 'public')
        }
    }
});



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
            plugin: vision  // a plugin used for rendering templates
        },
        {
            plugin: HapiSwagger,    // swagger api
            options: swaggerOptions
        },
        {
            plugin: pino,    // request logger
            options: {
                transport: {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                    }
                },
                level: 'debug'
            }
        }
    ]);

    server.logger.info('')


    server.auth.strategy('jwt', 'jwt', {        // inject the auth strategy as jwt into the server
        key: `${process.env.SECRET}`,
        validate: Container.get(AuthController).isLoggedIn      // the token will be decoded by the plugin automatically
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

const start = async () : Promise<Hapi.Server<Hapi.ServerApplicationState>> =>{
    await server.start();
    return server
}

export {init, start}
