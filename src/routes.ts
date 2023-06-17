import {ServerRoute} from "@hapi/hapi";
import {ReqRefDefaults} from "@hapi/hapi";
import Joi from "joi";
import {RoleController} from "./controllers/roleController";
import {UserController} from "./controllers/userController";


const routes : ServerRoute<ReqRefDefaults>[] = [
    {
        method: "GET",
        path: "/api/v1/roles",
        handler: new RoleController().getRole
    },
    {
        method: "GET",
        path: "/api/v1/users",
        handler: new UserController().getUsers
    },
    {
        method: "GET",
        path: "/api/v1/users/getOne/{id}",
        options:{
            validate:{
                params: Joi.object({
                    id: Joi.string().alphanum().required()
                })
            }
        },
        handler: new UserController().getUser
    }
]

export default routes;
