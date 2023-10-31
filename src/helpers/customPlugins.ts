import {Server} from "@hapi/hapi";

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
        });
    }
}

export{eventHandlerPlugin}
