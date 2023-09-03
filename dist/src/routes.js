"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const roleController_1 = require("./controllers/roleController");
const userController_1 = require("./controllers/userController");
const userProfileController_1 = require("./controllers/userProfileController");
const authController_1 = require("./controllers/authController");
const notificationController_1 = require("./controllers/notificationController");
const errorCatcher_1 = require("./helpers/errorCatcher");
const typedi_1 = require("typedi");
const boom_1 = require("@hapi/boom");
const routes = [
    {
        method: "GET",
        path: "/api/v1/roles",
        options: {
            auth: "jwt"
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(roleController_1.RoleController).getAllRoles),
    },
    {
        method: "GET",
        path: "/api/v1/users",
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(userController_1.UserController).getUsers),
        options: {
            auth: "jwt"
        }
    },
    {
        method: "GET",
        path: "/api/v1/users/getOne/{id}",
        options: {
            validate: {
                params: joi_1.default.object({
                    id: joi_1.default.string().alphanum().required()
                })
            },
            auth: "jwt"
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(userController_1.UserController).getUser)
    },
    {
        method: "POST",
        path: "/api/v1/users/create",
        options: {
            validate: {
                payload: joi_1.default.object({
                    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).required().error(new boom_1.Boom("email input validation failed", { statusCode: 422 })),
                    password: joi_1.default.string().min(8).error(new boom_1.Boom("password input validation failed", { statusCode: 422 }))
                })
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(userController_1.UserController).CreateUser)
    },
    {
        method: "PUT",
        path: "/api/v1/users/update/{id}",
        options: {
            validate: {
                payload: joi_1.default.object({
                    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).error(new boom_1.Boom("email input validation failed", { statusCode: 422 })),
                    password: joi_1.default.string().min(8).error(new boom_1.Boom("password input validation failed", { statusCode: 422 }))
                }),
                params: joi_1.default.object({
                    id: joi_1.default.string().alphanum().required()
                })
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(userController_1.UserController).UpdateUser),
    },
    {
        method: "POST",
        path: "/api/v1/userProfile/create",
        options: {
            payload: {
                allow: "multipart/form-data",
                parse: true,
                multipart: {
                    output: "file"
                },
                maxBytes: 1000 * 1000 * 2,
                uploads: 'public/tmp',
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(userProfileController_1.UserProfileController).createProfile)
    },
    {
        method: "POST",
        path: "/api/v1/login",
        options: {
            cors: {
                origin: ['*'],
                headers: ["Accept", "Content-Type"],
                additionalHeaders: ["X-Requested-With"]
            },
            validate: {
                payload: joi_1.default.object({
                    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).required().error(new boom_1.Boom("email input validation failed", { statusCode: 422 })),
                    password: joi_1.default.string().min(8).required().error(new boom_1.Boom("password input validation failed", { statusCode: 422 }))
                })
            },
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(authController_1.AuthController).login),
    },
    {
        method: "GET",
        path: "/api/v1/notification",
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(notificationController_1.NotificationController).getNotification)
    },
    {
        method: "POST",
        path: "/api/v1/create_notification",
        options: {
            validate: {
                payload: joi_1.default.object({
                    notification: joi_1.default.string().required().error(new boom_1.Boom("no notification provided or is not in string format", { statusCode: 422 }))
                })
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(notificationController_1.NotificationController).createNotification)
    },
    {
        method: "PUT",
        path: "/api/v1/notification_status/{id}",
        options: {
            validate: {
                params: joi_1.default.object({
                    id: joi_1.default.string().required().error(new boom_1.Boom("id not provided in the parameters", { statusCode: 422 }))
                }),
                payload: joi_1.default.object({
                    read_status: joi_1.default.number().required().error(new boom_1.Boom("read_status is either not provided or is not a number", { statusCode: 422 }))
                })
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(notificationController_1.NotificationController).changeReadStatus)
    }
];
exports.default = routes;
