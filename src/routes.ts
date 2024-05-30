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
import {inputValidations} from "./helpers/inputValidator";
import {fileProcessor} from "./helpers/fileProcessor";
import {imageResizer} from "./helpers/imageResizer";
import {TestController} from "./modules/test/test.controller";
import {multipartConfig} from "./helpers/multipartConfiguration";

const prefix : string = "/api/v1"

const routes : ServerRoute[] = [

    // FEATURE : LOGIN/LOGOUT
    {
        method: "POST",
        path: `${prefix}/login`,
        handler: errorCatcher(Container.get(AuthController).generalLogin),
    },
    {
        method: "GET",
        path: `${prefix}/logout`,
        options: {
            auth: "jwt"
        },
        handler: errorCatcher(Container.get(AuthController).logout),
    },

    {
        method: "*",
        path: `${prefix}/test`,
        handler: errorCatcher(Container.get(TestController).getAll)
    },


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
        options: {
            validate: {
                params: inputValidations.paginationParam
            },
            auth: "jwt"
        },
        handler: errorCatcher(Container.get(UserController).getUsers)
    },
    {
        method: "GET",
        path: `${prefix}/users/get_one/{id}`,
        options:{
            validate:{
                params: inputValidations.idParam
            },
            // auth: "jwt"
        },
        handler: errorCatcher(Container.get(UserController).getUser)
    },
    {
        method: "POST",
        path: `${prefix}/users/create_new`,
        options:{
            validate: {
                payload: Joi.object({
                    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).required().error(badData("email input validation error")),
                    password: Joi.string().trim().min(8).error(badData("password input validation failed"))
                })
            }
        },
        handler: errorCatcher(Container.get(UserController).CreateUser)
    },
    {
        method: "PUT",
        path: `${prefix}/users/update_info/{id}`,
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).error(badData("email validation failed")),
                    password: Joi.string().trim().min(8).error(badData("password input validation failed"))
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
        path: `${prefix}/user_profile/create_new`,
        options:  {
            payload: multipartConfig(2, 60000)
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
                params: inputValidations.paginationParam,
                payload: Joi.object({
                    read_status: Joi.number().required().error(badData("Please provide the read_status. It must be in number format"))
                })
            }
        },
        handler: errorCatcher(Container.get(NotificationController).changeReadStatus)
    },
    {
        method: "POST",
        path: `${prefix}/test_image_resizer`,
        options: {
          payload: multipartConfig(3, 60000)
        },
        handler: errorCatcher(async function(req: any, h:ResponseToolkit<ReqRefDefaults>){
            const {payload} = req
            if (payload.profile_photo) payload.profile_photo = await fileProcessor(payload.profile_photo, ["jpeg", "png"], 3000000, "profile");
            return await imageResizer({width: 100, height: 100}, payload.profile_photo)
            // return h.response(req.info.remoteAddress)
        })
    },
    {
        method: "POST",
        path: `${prefix}/upload_test`,
        options: {
            payload: multipartConfig(2, 60000)
        },
        handler: errorCatcher(Container.get(TestController).upload)
    },
]

export default routes;
