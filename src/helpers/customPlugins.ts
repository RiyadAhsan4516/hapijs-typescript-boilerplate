import {Server} from "@hapi/hapi";
import {schedule} from "node-cron";
import {cronJobs} from "../modules/cronJobs/cronDistributor";

type plugins = {
    name: string,
    version : string,
    register : any
}

const eventHandlerPlugin : plugins = {
    name : 'server_events',
    version: "0.1.1",
    register : async function(server : Server, options : {Server : Server}) : Promise<void>{
        options.Server.events.on('empty_temp', async (payload : any) : Promise<void> => {
            let data : string = JSON.stringify(payload);
            console.log(`Response inside the event: ${data}`);
            console.log(server)
        });
    }
}

const cronPlugin : plugins = {
    name: 'hapi-schedule',
    version: '0.1.0',
    register: async function() : Promise<void>{
        cronJobs.forEach((job: any)=> {
            if(job.status) schedule(job.schedule, job.task)
        })
    }
}


export{eventHandlerPlugin, cronPlugin}
