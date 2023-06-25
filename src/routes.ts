import Joi from "joi";
import {ServerRoute} from "@hapi/hapi";
import {ReqRefDefaults} from "@hapi/hapi";
import {RoleController} from "./controllers/roleController";
import {UserController} from "./controllers/userController";
import {UserProfileController} from "./controllers/userProfileController";
import {AuthController} from "./controllers/authController";
import {Container} from "typedi";

const routes : ServerRoute<ReqRefDefaults>[] = [
    {
        method: "GET",
        path: "/api/v1/roles",
        handler: Container.get(RoleController).getAllRoles,

    },
    {
        method: "GET",
        path: "/api/v1/users",
        handler: Container.get(UserController).getUsers,
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
        handler: Container.get(UserController).getUser
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
        handler: Container.get(UserController).CreateUser
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
        handler: Container.get(UserController).UpdateUser,
    },
    {
        method: "POST",
        path: "/api/v1/userProfile/create",
        options:  {
            payload: {
                allow: "multipart/form-data",
                parse: true,
                multipart: {
                    output: "file"
                },
                maxBytes: 1000 * 1000 * 5, // 5 Mb
                uploads: 'public/tmp',
            }
        },
        handler: Container.get(UserProfileController).createProfile
    },
    {
        method: "POST",
        path: "/api/v1/login",
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).required(),
                    password: Joi.string().min(8).required()
                })
            },
        },
        handler: Container.get(AuthController).login,
    }

]

export default routes;
