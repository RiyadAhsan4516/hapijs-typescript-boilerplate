import * as dotenv from "dotenv"
dotenv.config();

import {AppDataSource} from "./data-source";
import "reflect-metadata";
import {init} from "./app";
import * as Hapi from "@hapi/hapi";



// ********************************************
// *                                          *
// *        INITIALIZE THE DATABASE           *
// *                                          *
// ********************************************

AppDataSource.initialize().catch((err)=>{
    console.error("Database failed to load : ", err)
})


// ********************************************
// *                                          *
// *      HANDLE UNHANDLED REJECTIONS         *
// *                                          *
// ********************************************
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});



// ********************************************
// *                                          *
// *    INITIALIZE AND START THE SERVER       *
// *                                          *
// ********************************************

async function launch(){
    if(process.env.NODE_ENV === 'development') {
        console.log(`[server]: ${process.env.LOCALHOST}:${process.env.PORT}`)
    } else {
        console.log("Environment switched to production")
    }

    let server : Hapi.Server<Hapi.ServerApplicationState> =  await init();
    await server.start();

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('Shutting down gracefully...');
        await server.stop({ timeout: 10000 });
        console.log('Server stopped');
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('Terminating server...');
        await server.stop({ timeout: 10000 });
        console.log('Server terminated');
        process.exit(1);
    });

}

launch().then(() : void=>{}).catch(err=>{
    console.log(`Launch failed : ${err}`);
})
