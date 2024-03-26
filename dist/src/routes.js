"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// THIRD PARTY IMPORTS
const joi_1 = __importDefault(require("joi"));
const typedi_1 = require("typedi");
const boom_1 = require("@hapi/boom");
// LOCAL MODULE IMPORTS
const roles_controller_1 = require("./modules/roles/roles.controller");
const userAccount_controller_1 = require("./modules/userAccount/userAccount.controller");
const userProfile_controller_1 = require("./modules/userProfile/userProfile.controller");
const authentication_controller_1 = require("./modules/authentication/authentication.controller");
const notification_controller_1 = require("./modules/notification/notification.controller");
const errorCatcher_1 = require("./helpers/errorCatcher");
const inputValidator_1 = require("./helpers/inputValidator");
const prefix = "/api/v1";
const routes = [
    {
        method: "*",
        path: `${prefix}/roles`,
        options: {
            auth: "static"
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(roles_controller_1.RoleController).getAllRoles),
    },
    {
        method: "GET",
        path: `${prefix}/users/all_users/{limit}/{pageNo}`,
        options: {
            validate: {
                params: inputValidator_1.inputValidations.paginationParam
            }
            // auth: "jwt"
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(userAccount_controller_1.UserController).getUsers)
    },
    {
        method: "GET",
        path: `${prefix}/users/get_one/{id}`,
        options: {
            validate: {
                params: joi_1.default.object({
                    id: joi_1.default.string().alphanum().required().error((0, boom_1.badData)("id sent in param is not valid"))
                })
            },
            // auth: "jwt"
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(userAccount_controller_1.UserController).getUser)
    },
    {
        method: "POST",
        path: `${prefix}/users/createNew`,
        options: {
            validate: {
                payload: joi_1.default.object({
                    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).required().error((0, boom_1.badData)("email input validation failed")),
                    password: joi_1.default.string().min(8).error((0, boom_1.badData)("password input validation failed"))
                })
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(userAccount_controller_1.UserController).CreateUser)
    },
    {
        method: "PUT",
        path: `${prefix}/users/updateInfo/{id}`,
        options: {
            validate: {
                payload: joi_1.default.object({
                    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).error((0, boom_1.badData)("email input validation failed")),
                    password: joi_1.default.string().min(8).error((0, boom_1.badData)("password input validation failed"))
                }),
                params: joi_1.default.object({
                    id: joi_1.default.string().alphanum().required().error((0, boom_1.badData)("id validation on parameters failed"))
                })
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(userAccount_controller_1.UserController).UpdateUser),
    },
    {
        method: "POST",
        path: `${prefix}/userProfile/createNew`,
        options: {
            payload: {
                allow: "multipart/form-data",
                parse: true,
                multipart: {
                    output: "file"
                },
                maxBytes: 1000 * 1000 * 2,
                timeout: 60000,
                uploads: 'public/tmp',
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(userProfile_controller_1.UserProfileController).createProfile)
    },
    {
        method: "*",
        path: `${prefix}/get_salt/{key}`,
        options: {
            validate: {
                params: joi_1.default.object({
                    key: joi_1.default.string().required().valid('1', '2').error((0, boom_1.badData)("parameter 'key' must be provided as either 1 or 2"))
                })
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(authentication_controller_1.AuthController).provideSaltKey)
    },
    {
        method: "POST",
        path: `${prefix}/login`,
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(authentication_controller_1.AuthController).saltLogin),
    },
    {
        method: "GET",
        path: `${prefix}/notification`,
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(notification_controller_1.NotificationController).getNotification)
    },
    {
        method: "POST",
        path: `${prefix}/create_notification`,
        options: {
            validate: {
                payload: joi_1.default.object({
                    notification: joi_1.default.string().required().error((0, boom_1.badData)("no notification was provided in string format"))
                })
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(notification_controller_1.NotificationController).createNotification)
    },
    {
        method: "PUT",
        path: `${prefix}/notification_status/{id}`,
        options: {
            validate: {
                params: inputValidator_1.inputValidations.paginationParam,
                payload: joi_1.default.object({
                    read_status: joi_1.default.number().required().error((0, boom_1.badData)("Please provide the read_status. It must be in number format"))
                })
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(notification_controller_1.NotificationController).changeReadStatus)
    },
    {
        method: "POST",
        path: `${prefix}/test`,
        options: {
            payload: {
                allow: "multipart/form-data",
                parse: true,
                multipart: {
                    output: "file", // use file to allow multiple files
                },
                maxBytes: 1000 * 1000 * 2,
                uploads: 'public/tmp',
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(function (req, h) {
            return __awaiter(this, void 0, void 0, function* () {
                const { payload } = req;
                return payload;
            });
        })
    }
];
exports.default = routes;
