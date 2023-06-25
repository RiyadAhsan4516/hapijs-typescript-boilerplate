import * as dotenv from "dotenv"
dotenv.config();

import * as Hapi from "@hapi/hapi"
import * as path from "path";
import routes from "./src/routes";
import * as inert from "@hapi/inert";
import * as HapiJwt from "hapi-auth-jwt2";
import {AuthController} from "./src/controllers/authController";
import {Container} from "typedi";
import {ReqRefDefaults, Request, ResponseToolkit} from "@hapi/hapi";
import * as HapiSwagger from "hapi-swagger";
import * as vision from "@hapi/vision";

const SwaggerYaml = require("./assets/swagger.json")

const swaggerOptions : {} = {
    // info: {
    //     title: 'HapiScript documentation',
    //     description: 'This is a sample example of API documentation.'
    // },
    // OAS: 'v3.0',
    customSwaggerFile : SwaggerYaml
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
            plugin: inert
        },
        {
            plugin: HapiJwt
        },
        {
            plugin: vision
        },
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);


    server.auth.strategy('jwt', 'jwt', {
        key: `${process.env.SECRET}`,
        validate: Container.get(AuthController).isLoggedIn
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
