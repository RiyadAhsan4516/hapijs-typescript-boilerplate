"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const roleController_1 = require("./controllers/roleController");
const userController_1 = require("./controllers/userController");
const userProfileController_1 = require("./controllers/userProfileController");
const routes = [
    {
        method: "GET",
        path: "/api/v1/roles",
        handler: new roleController_1.RoleController().getRole
    },
    {
        method: "GET",
        path: "/api/v1/users",
        handler: new userController_1.UserController().getUsers
    },
    {
        method: "GET",
        path: "/api/v1/users/getOne/{id}",
        options: {
            validate: {
                params: joi_1.default.object({
                    id: joi_1.default.string().alphanum().required()
                })
            }
        },
        handler: new userController_1.UserController().getUser
    },
    {
        method: "POST",
        path: "/api/v1/users/create",
        options: {
            validate: {
                payload: joi_1.default.object({
                    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }).required(),
                    password: joi_1.default.string().min(8)
                })
            }
        },
        handler: new userController_1.UserController().CreateUser
    },
    {
        method: "PUT",
        path: "/api/v1/users/update/{id}",
        options: {
            validate: {
                payload: joi_1.default.object({
                    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }),
                    password: joi_1.default.string().min(8)
                }),
                params: joi_1.default.object({
                    id: joi_1.default.string().alphanum().required()
                })
            }
        },
        handler: new userController_1.UserController().UpdateUser
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
                maxBytes: 1000 * 1000 * 5,
                uploads: 'public/tmp',
            }
        },
        handler: new userProfileController_1.UserProfileController().createProfile
    }
];
exports.default = routes;
