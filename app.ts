import * as dotenv from "dotenv"
dotenv.config();

import * as Hapi from "@hapi/hapi"
// import * as Bell from "@hapi/bell";
import {AppDataSource} from "./src/data-source";
import type { ReqRefDefaults, Request, ResponseToolkit } from '@hapi/hapi';
import path from "path";
import "reflect-metadata";
import {Boom} from "@hapi/boom";
import routes from "./src/routes";



const init = async () => {

    // INITIALIZE THE DATABASE
    if(process.env.NODE_ENV==='development') {
        console.log("Environment switched to development");

        AppDataSource.initialize()
            .then(() => {
                console.log("Data Source has been initialized!")
            })
            .catch((err) => {
                console.error("Error during Data Source initialization", err)
            })
    } else {
        AppDataSource.initialize().catch((err)=>{
            console.error("Database failed to load")
        })
    }

    // CREATE AND START THE SERVER
    const server : Hapi.Server<Hapi.ServerApplicationState> = Hapi.server({
        port: process.env.PORT,
        host: process.env.LOCALHOST,
        routes: {
            files:{
                relativeTo: path.join(__dirname, 'public')
            }
        }
    });

    await server.register(require('@hapi/inert'));

    server.route(routes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
