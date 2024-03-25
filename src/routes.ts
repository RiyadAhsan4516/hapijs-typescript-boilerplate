// THIRD PARTY IMPORTS
import Joi from "joi";
import {ReqRefDefaults, ResponseToolkit, ServerRoute} from "@hapi/hapi";
import {Container} from "typedi";
import {badData} from "@hapi/boom";

// LOCAL MODULE IMPORTS
import {RoleController} from "./modules/roles/roles.controller";
import {UserController} from "./modules/userAccount/userAccount.controller";
import {UserProfileController} from "./modules/userProfile/userProfile.controller";
import {AuthController} from "./modules/authentication/authentication.controller";
import {NotificationController} from "./modules/notification/notification.controller";
import {errorCatcher} from "./helpers/errorCatcher";

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
        path: `${prefix}/users/all_users/{limit}/{pageNo}`,
        // options: {
        //     auth: "jwt"
        // },
        handler: errorCatcher(Container.get(UserController).getUsers)
    },
    {
        method: "GET",
        path: `${prefix}/users/get_one/{id}`,
        options:{
            validate:{
                params: Joi.object({
                    id: Joi.string().alphanum().required().error(badData("id sent in param is not valid"))
                })
            },
            // auth: "jwt"
        },
        handler: errorCatcher(Container.get(UserController).getUser)
    },
    {
        method: "POST",
        path: `${prefix}/users/createNew`,
        options:{
            validate: {
                payload: Joi.object({
                    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).required().error(badData("email input validation failed")),
                    password: Joi.string().min(8).error(badData("password input validation failed"))
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
                    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).error(badData("email input validation failed")),
                    password: Joi.string().min(8).error(badData("password input validation failed"))
                }),
                params: Joi.object({
                    id: Joi.string().alphanum().required().error(badData("id validation on parameters failed"))
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
        method: "*",
        path : `${prefix}/get_salt/{key}`,
        options: {
            validate : {
                params: Joi.object({
                    key : Joi.string().required().valid('1','2').error(badData("parameter 'key' must be provided as either 1 or 2"))
                })
            }
        },
        handler : errorCatcher(Container.get(AuthController).provideSaltKey)
    },
    {
        method: "POST",
        path: `${prefix}/login`,
        handler: errorCatcher(Container.get(AuthController).saltLogin),
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
                    notification: Joi.string().required().error(badData("no notification was provided in string format"))
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
                    id: Joi.string().required().error(badData("Please provide id as a request parameter"))
                }),
                payload: Joi.object({
                    read_status: Joi.number().required().error(badData("Please provide the read_status. It must be in number format"))
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
              maxBytes: 1000 * 1000 * 2, // 2 Mb
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
