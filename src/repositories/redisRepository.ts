import {Repository} from "redis-om"
import {client} from "../../app";

// IMPORT ALL THE AVAILABLE SCHEMAS
import {roleSchema} from "../redisSchemas/roleSchema";


const roleRepo = new Repository(roleSchema, client);


// EXPORT ALL THE REPO INSTANCES CREATED SO FAR
export {roleRepo}
