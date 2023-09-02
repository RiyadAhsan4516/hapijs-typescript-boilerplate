import Joi from "joi";
import {ServerRoute} from "@hapi/hapi";
import {RoleController} from "./controllers/roleController";
import {UserController} from "./controllers/userController";
import {UserProfileController} from "./controllers/userProfileController";
import {AuthController} from "./controllers/authController";
import {NotificationController} from "./controllers/notificationController"
import {errorCatcher} from "./helpers/errorCatcher";
import {Container} from "typedi";
import {Boom} from "@hapi/boom";

import {NotificationService} from "./services/notificationService"

const routes : ServerRoute[] = [
    {
        method: "GET",
        path: "/api/v1/roles",
        options:{
            auth: "static"
        },
        handler: errorCatcher(Container.get(RoleController).getAllRoles),
    },
    {
        method: "GET",
        path: "/api/v1/users",
        handler: errorCatcher(Container.get(UserController).getUsers),
        options: {
            auth: "jwt"
        }
    },
    {
        method: "GET",
        path: "/api/v1/users/getOne/{id}",
        options:{
            validate:{
                params: Joi.object({
                    id: Joi.string().alphanum().required()
                })
            },
            auth: "jwt"
        },
        handler: errorCatcher(Container.get(UserController).getUser)
    },
    {
        method: "POST",
        path: "/api/v1/users/create",
        options:{
            validate: {
                payload: Joi.object({
                    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).required().error(new Boom("email input validation failed", {statusCode:422})),
                    password: Joi.string().min(8).error(new Boom("password input validation failed", {statusCode:422}))
                })
            }
        },
        handler: errorCatcher(Container.get(UserController).CreateUser)
    },
    {
        method: "PUT",
        path: "/api/v1/users/update/{id}",
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).error(new Boom("email input validation failed", {statusCode:422})),
                    password: Joi.string().min(8).error(new Boom("password input validation failed", {statusCode:422}))
                }),
                params: Joi.object({
                    id: Joi.string().alphanum().required()
                })
            }
        },
        handler: errorCatcher(Container.get(UserController).UpdateUser),
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
                maxBytes: 1000 * 1000 * 2, // 2 Mb
                uploads: 'public/tmp',
            }
        },
        handler: errorCatcher(Container.get(UserProfileController).createProfile)
    },
    {
        method: "POST",
        path: "/api/v1/login",
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).required().error(new Boom("email input validation failed", {statusCode:422})),
                    password: Joi.string().min(8).required().error(new Boom("password input validation failed", {statusCode:422}))
                })
            },
        },
        handler: errorCatcher(Container.get(AuthController).login),
    },
    {
        method: "GET",
        path: "/api/v1/notification",
        handler : errorCatcher(Container.get(NotificationController).getNotification)
    },
    {
        method: "POST",
        path: "/api/v1/create_notification",
        options: {
            validate: {
                payload: Joi.object({
                    notification: Joi.string().required().error(new Boom("no notification provided or is not in string format", {statusCode: 422}))
                })
            }
        },
        handler: errorCatcher(Container.get(NotificationController).createNotification)
    },
    {
        method: "PUT",
        path: "/api/v1/notification_status/{id}",
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.string().required().error(new Boom("id not provided in the parameters", {statusCode: 422}))
                }),
                payload: Joi.object({
                    read_status: Joi.number().required().error(new Boom("read_status is either not provided or is not a number", {statusCode: 422}))
                })
            }
        },
        handler: errorCatcher(Container.get(NotificationController).changeReadStatus)
    },

]

export default routes;
