import {Schema} from "redis-om";

const roleSchema : Schema = new Schema('roles', {
    name: {type: "string"}
},{
    dataStructure: "JSON"
})

export {roleSchema}
