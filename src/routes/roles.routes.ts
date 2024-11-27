import {errorCatcher} from "../helpers/errorCatcher";
import {Container} from "typedi";
import {RoleController} from "../modules/roles/roles.controller";

let rolesController : RoleController = Container.get(RoleController);


export const roles = [
    {
        method: "GET",
        path: `/api/v1/roles`,
        options: {
            auth: "static"
        },
        handler: errorCatcher(rolesController.getAllRoles.bind(rolesController)),
    },
]
