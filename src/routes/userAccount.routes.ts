import {inputValidations} from "../helpers/inputValidator";
import {errorCatcher} from "../helpers/errorCatcher";
import {Container} from "typedi";
import Joi from "joi";
import {badData} from "@hapi/boom";
import {UserAccountController} from "../modules/userAccount/userAccount.controller";

let userAccountController : UserAccountController = Container.get(UserAccountController);


export const userAccount = [
    {
        method: "GET",
        path: `/api/v1/users/all-users/{limit}/{pageNo}`,
        options: {
            validate: {
                params: inputValidations.paginationParam
            },
            auth: "jwt",
        },
        handler: errorCatcher(userAccountController.getUsers.bind(userAccountController))
    },
    {
        method: "GET",
        path: `/api/v1/users/get-one/{id}`,
        options:{
            validate:{
                params: inputValidations.idParam
            }
        },
        handler: errorCatcher(userAccountController.getUser.bind(userAccountController))
    },
    {
        method: "POST",
        path: `/api/v1/users/create-new`,
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
        path: `/api/v1/users/update-info/{id}`,
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

]

