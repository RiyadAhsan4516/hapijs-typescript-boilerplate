import * as dotenv from "dotenv"
dotenv.config();

import * as Hapi from "@hapi/hapi"
import * as path from "path";
import routes from "./src/routes";
import * as inert from "@hapi/inert";
import * as HapiJwt from "hapi-auth-jwt2";
import {Authenticator} from "./src/controllers/authController";
import {Container} from "typedi";

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
        // {
        //     plugin: HapiJwt
        // }
    ]);

    // server.auth.strategy('jwt', 'jwt', Container.get(Authenticator))

    server.route({
        method: 'GET',
        path: '/{picture}',
        handler: function (req, h) {

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
