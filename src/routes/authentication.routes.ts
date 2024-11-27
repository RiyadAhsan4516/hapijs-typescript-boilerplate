import {errorCatcher} from "../helpers/errorCatcher";
import {Container} from "typedi";
import {AuthController} from "../modules/authentication/authentication.controller";

let authController : AuthController = Container.get(AuthController);

export const authentication = [
    {
        method: "POST",
        path: `/api/v1/login`,
        handler: errorCatcher(authController.generalLogin.bind(authController)),
    },
    {
        method: "GET",
        path: `/api/v1/logout`,
        options: {
            auth: "jwt"
        },
        handler: errorCatcher(authController.logout.bind(authController)),
    },
]
