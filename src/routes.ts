// THIRD PARTY IMPORTS
import Joi from "joi";
import {ReqRefDefaults, ResponseToolkit, Server} from "@hapi/hapi";
import {Container} from "typedi";
import {badData} from "@hapi/boom";

// LOCAL MODULE IMPORTS
import {RoleController} from "./modules/roles/roles.controller";
import {AuthController} from "./modules/authentication/authentication.controller";
import {NotificationController} from "./modules/notification/notification.controller";
import {errorCatcher} from "./helpers/errorCatcher";
import {inputValidations} from "./helpers/inputValidator";
import {fileProcessor} from "./helpers/fileProcessor";
import {imageResizer} from "./helpers/imageResizer";
import {TestController} from "./modules/test/test.controller";
import {multipartConfig} from "./config/multipartConfiguration";
import {UserAccountController} from "./modules/userAccount/userAccount.controller";

const prefix : string = "/api/v1"

export function serverRoutes(server: Server) {
    
    let authController : AuthController = Container.get(AuthController);
    let rolesController : RoleController = Container.get(RoleController);
    let userAccountController : UserAccountController = Container.get(UserAccountController);
    

    return server.route(
        [

            // FEATURE : LOGIN/LOGOUT
            {
                method: "POST",
                path: `${prefix}/login`,
                handler: errorCatcher(authController.generalLogin.bind(authController)),
            },
            {
                method: "GET",
                path: `${prefix}/logout`,
                options: {
                    auth: "jwt"
                },
                handler: errorCatcher(authController.logout.bind(authController)),
            },


            // FEATURE : FORGOT PASSWORD
            {
                method: "POST",
                path: `${prefix}/forgot_password`,
                options: {
                    validate: {
                        payload: inputValidations.forgot_password
                    }
                },
                handler: errorCatcher(authController.forgotPassword.bind(authController))
            },
            {
                method: "POST",
                path: `${prefix}/recover_token`,
                options: {
                    validate: {
                        payload: inputValidations.recover_token
                    }
                },
                handler: errorCatcher(authController.recoveryToken.bind(authController))
            },
            {
                method: "PUT",
                path: `${prefix}/update_password`,
                options: {
                    auth: "jwt",
                    validate: {
                        payload: inputValidations.reset_password
                    }
                },
                handler: errorCatcher(authController.resetPassword.bind(authController))
            },


            // FEATURE : USER ACCOUNT
            {
                method: "GET",
                path: `${prefix}/users/all_users/{limit}/{pageNo}`,
                options: {
                    validate: {
                        params: inputValidations.paginationParam
                    },
                    auth: "jwt"
                },
                handler: errorCatcher(userAccountController.getUsers.bind(userAccountController))
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
                handler: errorCatcher(userAccountController.getUser.bind(userAccountController))
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
                handler: errorCatcher(userAccountController.CreateUser.bind(userAccountController))
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
                handler: errorCatcher(userAccountController.UpdateUser.bind(userAccountController)),
            },


            // FEATURE : NOTIFICATION
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


            // FEATURE : ROLES
            {
                method: "GET",
                path: `${prefix}/roles`,
                options:{
                    auth: "static"
                },
                handler: errorCatcher(rolesController.getAllRoles.bind(rolesController)),
            },


            // FEATURE : TEST ROUTES
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
            {
                method: "*",
                path: `${prefix}/test`,
                handler: errorCatcher(Container.get(TestController).getAll)
            },
        ]
    )

}
