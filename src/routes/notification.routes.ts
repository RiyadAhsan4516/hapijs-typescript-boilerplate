import {inputValidations} from "../helpers/inputValidator";
import {errorCatcher} from "../config/errorCatcher";
import {Container} from "typedi";
import Joi from "joi";
import {badData} from "@hapi/boom";
import {NotificationController} from "../modules/notification/notification.controller";

let notificationController : NotificationController = Container.get(NotificationController);


export const notification = [
    {
        method: "GET",
        path: `/api/v1/notification`,
        handler : errorCatcher(notificationController.getNotification.bind(notificationController))
    },
    {
        method: "POST",
        path: `/api/v1/create-notification`,
        options: {
            validate: {
                payload: Joi.object({
                    notification: Joi.string().required().error(badData("no notification was provided in string format"))
                })
            }
        },
        handler: errorCatcher(notificationController.createNotification.bind(notificationController))
    },
    {
        method: "PUT",
        path: `/api/v1/notification-status/{id}`,
        options: {
            validate: {
                params: inputValidations.paginationParam,
                payload: Joi.object({
                    read_status: Joi.number().required().error(badData("Please provide the read_status. It must be in number format"))
                })
            }
        },
        handler: errorCatcher(notificationController.changeReadStatus.bind(notificationController))
    },

]
