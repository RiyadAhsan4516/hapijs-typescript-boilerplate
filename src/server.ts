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
        let server : Hapi.Server<Hapi.ServerApplicationState> =   await init();
        await server.start();
        console.log(`[server]: ${process.env.LOCALHOST}:${process.env.PORT}`)
    } else {
        let server : Hapi.Server<Hapi.ServerApplicationState> =   await init();
        await server.start();
    }
}

launch().then(() : void=>{}).catch(err=>{
    console.log(`Launch failed : ${err}`);
})
