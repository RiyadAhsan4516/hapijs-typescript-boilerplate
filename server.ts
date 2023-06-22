import * as dotenv from "dotenv"
dotenv.config();

import {AppDataSource} from "./src/data-source";
import "reflect-metadata";
import {init, start} from "./app";



// ********************************************
// *                                          *
// *        INITIALIZE THE DATABASE           *
// *                                          *
// ********************************************

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
        console.log("LAUNCHING THE SERVER =====>")
        await init();
        await start()
        console.log(`[server:] running on http://${process.env.LOCALHOST}:${process.env.PORT}`)
    } else {
        await init();
        await start()
    }
}

launch().then(()=>{
    if(process.env.NODE_ENV === 'development') console.log("<========== SERVER LAUNCHED")
}).catch(err=>{
    console.log("THERE WAS AN ERROR LAUNCHING THE SERVER")
})
