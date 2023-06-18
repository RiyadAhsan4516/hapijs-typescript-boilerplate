import {ServerRoute} from "@hapi/hapi";
import {ReqRefDefaults} from "@hapi/hapi";
import Joi from "joi";
import {RoleController} from "./controllers/roleController";
import {UserController} from "./controllers/userController";
import {UserProfileController} from "./controllers/userProfileController";


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
    },
    {
        method: "POST",
        path: "/api/v1/users/create",
        options:{
            validate: {
                payload: Joi.object({
                    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).required(),
                    password: Joi.string().min(8)
                })
            }
        },
        handler: new UserController().CreateUser
    },
    {
        method: "PUT",
        path: "/api/v1/users/update/{id}",
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }),
                    password: Joi.string().min(8)
                }),
                params: Joi.object({
                    id: Joi.string().alphanum().required()
                })
            }
        },
        handler: new UserController().UpdateUser
    },
    {
        method: "POST",
        path: "/api/v1/userProfile/create",
        options:  {
            payload: {
                parse: true,
                allow: "multipart/form-data",
                multipart: {
                    output: 'stream'
                },
                maxBytes: 1000 * 1000 * 5, // 5 Mb
            }
        },
        handler: new UserProfileController().createProfile
    }
]

export default routes;
