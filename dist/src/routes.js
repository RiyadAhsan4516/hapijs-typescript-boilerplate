"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const joi_1 = __importDefault(require("joi"));
const roleController_1 = require("./controllers/roleController");
const userController_1 = require("./controllers/userController");
const userProfileController_1 = require("./controllers/userProfileController");
const authController_1 = require("./controllers/authController");
const notificationController_1 = require("./controllers/notificationController");
const errorCatcher_1 = require("./helpers/errorCatcher");
const typedi_1 = require("typedi");
const Boom = __importStar(require("@hapi/boom"));
const prefix = "/api/v1";
const routes = [
    {
        method: "*",
        path: `${prefix}/roles`,
        options: {
            auth: "static"
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(roleController_1.RoleController).getAllRoles),
    },
    {
        method: "GET",
        path: `${prefix}/users/allUsers`,
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(userController_1.UserController).getUsers),
        options: {
            auth: "jwt"
        }
    },
    {
        method: "GET",
        path: `${prefix}/users/getOne/{id}`,
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
        path: `${prefix}/users/createNew`,
        options: {
            validate: {
                payload: joi_1.default.object({
                    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).required().error(Boom.badData("email input validation failed")),
                    password: joi_1.default.string().min(8).error(Boom.badData("password input validation failed"))
                })
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(userController_1.UserController).CreateUser)
    },
    {
        method: "PUT",
        path: `${prefix}/users/updateInfo/{id}`,
        options: {
            validate: {
                payload: joi_1.default.object({
                    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).error(Boom.badData("email input validation failed")),
                    password: joi_1.default.string().min(8).error(Boom.badData("password input validation failed"))
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
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(userProfileController_1.UserProfileController).createProfile)
    },
    {
        method: "POST",
        path: `${prefix}/login`,
        options: {
            cors: {
                origin: ['*'],
                headers: ["Accept", "Content-Type"],
                additionalHeaders: ["X-Requested-With"]
            },
            validate: {
                payload: joi_1.default.object({
                    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).required().error(Boom.badData("email input validation failed")),
                    password: joi_1.default.string().min(8).required().error(Boom.badData("password input validation failed"))
                })
            },
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(authController_1.AuthController).login),
    },
    {
        method: "GET",
        path: `${prefix}/notification`,
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(notificationController_1.NotificationController).getNotification)
    },
    {
        method: "POST",
        path: `${prefix}/create_notification`,
        options: {
            validate: {
                payload: joi_1.default.object({
                    notification: joi_1.default.string().required().error(Boom.badData("no notification was provided in string format"))
                })
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(notificationController_1.NotificationController).createNotification)
    },
    {
        method: "PUT",
        path: `${prefix}/notification_status/{id}`,
        options: {
            validate: {
                params: joi_1.default.object({
                    id: joi_1.default.string().required().error(Boom.badData("Please provide id as a request parameter"))
                }),
                payload: joi_1.default.object({
                    read_status: joi_1.default.number().required().error(Boom.badData("Please provide the read_status. It must be in number format"))
                })
            }
        },
        handler: (0, errorCatcher_1.errorCatcher)(typedi_1.Container.get(notificationController_1.NotificationController).changeReadStatus)
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
