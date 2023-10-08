import Joi from "joi";
import {ReqRefDefaults, ResponseToolkit, ServerRoute} from "@hapi/hapi";
import {RoleController} from "./controllers/roleController";
import {UserController} from "./controllers/userController";
import {UserProfileController} from "./controllers/userProfileController";
import {AuthController} from "./controllers/authController";
import {NotificationController} from "./controllers/notificationController"
import {errorCatcher} from "./helpers/errorCatcher";
import {Container} from "typedi";
import {Boom} from "@hapi/boom";

const prefix : string = "/api/v1"

const routes : ServerRoute[] = [
    {
        method: "*",
        path: `${prefix}/roles`,
        options:{
            auth: "static"
        },
        handler: errorCatcher(Container.get(RoleController).getAllRoles),
    },
    {
        method: "GET",
        path: `${prefix}/users/allUsers`,
        handler: errorCatcher(Container.get(UserController).getUsers),
        options: {
            auth: "jwt"
        }
    },
    {
        method: "GET",
        path: `${prefix}/users/getOne/{id}`,
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
        path: `${prefix}/users/createNew`,
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
        path: `${prefix}/users/updateInfo/{id}`,
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
        path: `${prefix}/userProfile/createNew`,
        options:  {
            payload: {
                allow: "multipart/form-data",
                parse: true,
                multipart: {
                    output: "file"
                },
                maxBytes: 1000 * 1000 * 2, // 2 Mb
                timeout: 60000,
                uploads: 'public/tmp',
            }
        },
        handler: errorCatcher(Container.get(UserProfileController).createProfile)
    },
    {
        method: "POST",
        path: `${prefix}/login`,
        options: {
            cors: {
                origin: ['*'], // Allow all origins
                headers: ["Accept", "Content-Type"],
                additionalHeaders: ["X-Requested-With"]
            },
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
        path: `${prefix}/notification`,
        handler : errorCatcher(Container.get(NotificationController).getNotification)
    },
    {
        method: "POST",
        path: `${prefix}/create_notification`,
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
        path: `${prefix}/notification_status/{id}`,
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
    {
        method: "POST",
        path: `${prefix}/test`,
        options: {
          payload: {
              allow: "multipart/form-data",
              parse: true,
              multipart: {
                  output: "file",    // use file to allow multiple files
              },
              maxBytes: 1000 * 1000 * 10, // 500 kb
              uploads: 'public/tmp',
          }
        },
        handler: errorCatcher(async function(req: any, h:ResponseToolkit<ReqRefDefaults>){
            const {payload} = req
            return payload;
        })
    }

]

export default routes;
