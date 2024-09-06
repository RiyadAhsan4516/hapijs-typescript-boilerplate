import Joi from "joi";
import {badData, badRequest} from "@hapi/boom";

export let inputValidations = {
    paginationParam: Joi.object({
        limit: Joi.number().min(1).error(badRequest("limit parameter cannot be less than 1")),
        pageNo: Joi.number().min(1).error(badRequest("pageNo parameter cannot be less than 1"))
    }),

    idParam: Joi.object({
        id: Joi.string().alphanum().required().error(badData("id sent in param is not valid"))
    },),

    // USER ACCOUNT
    update_account: Joi.object(
        {
            email: Joi.string().trim().email({
                minDomainSegments: 2,
                tlds: {allow: ['com', 'net', 'io']}
            }).error(badData("email input validation error")),
            newPassword: Joi.string().trim().min(8).error(badData("newPassword validation failed")), // New password is optional unless provided
            oldPassword: Joi.string().trim().min(8).when('newPassword', { // oldPassword is required if newPassword is provided
                is: Joi.exist(),
                then: Joi.required(),
                otherwise: Joi.optional()
            }),
            confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).when('newPassword', { // confirmNewPassword must match newPassword
                is: Joi.exist(),
                then: Joi.required(),
                otherwise: Joi.optional()
            })
        }
    ),

    // FORGOT PASSWORD
    forgot_password: Joi.object({
        email: Joi.string().trim().email({
            minDomainSegments: 2,
            tlds: {allow: ['com', 'net', 'io']}
        }).required().error(badData("email input validation error"))
    }),
    recover_token: Joi.object({
        code: Joi.string().trim().min(6).max(6).required().error(badData("code validation failed"))
    }),
    reset_password: Joi.object({
        new_password: Joi.string().trim().min(8).required().error(badData("new password validation failed")),
        confirm_password: Joi.string().trim().min(8).required().error(badData("confirm password validation failed")),
    }),

}
