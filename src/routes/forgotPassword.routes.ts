import {inputValidations} from "../helpers/inputValidator";
import {errorCatcher} from "../config/errorCatcher";
import {Container} from "typedi";
import {AuthController} from "../modules/authentication/authentication.controller";

let authController : AuthController = Container.get(AuthController);

export const forgotPassword = [
    {
        method: "POST",
        path: `/api/v1/forgot-password`,
        options: {
            validate: {
                payload: inputValidations.forgot_password
            }
        },
        handler: errorCatcher(authController.forgotPassword.bind(authController))
    },
    {
        method: "POST",
        path: `/api/v1/recover-token`,
        options: {
            validate: {
                payload: inputValidations.recover_token
            }
        },
        handler: errorCatcher(authController.recoveryToken.bind(authController))
    },
    {
        method: "PUT",
        path: `/api/v1/update-password`,
        options: {
            auth: "jwt",
            validate: {
                payload: inputValidations.reset_password
            }
        },
        handler: errorCatcher(authController.resetPassword.bind(authController))
    },
]
