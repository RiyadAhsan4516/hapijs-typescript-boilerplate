import Joi from "joi";
import {badData, badRequest} from "@hapi/boom";

export let inputValidations = {
    paginationParam: Joi.object({
        limit: Joi.number().min(1).error(badRequest("limit parameter cannot be less than 1")),
        pageNo: Joi.number().min(1).error(badRequest("pageNo parameter cannot be less than 1"))
    }),

    idParam: Joi.object({
        id: Joi.string().alphanum().required().error(badData("id sent in param is not valid"))
    },)

}
