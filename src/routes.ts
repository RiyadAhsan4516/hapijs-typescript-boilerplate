// THIRD PARTY IMPORTS
import {Server} from "@hapi/hapi";
import {test} from "./routes/test.routes"
import {authentication} from "./routes/authentication.routes";
import {forgotPassword} from "./routes/forgotPassword.routes";
import {userAccount} from "./routes/userAccount.routes";
import {roles} from "./routes/roles.routes";
import {notification} from "./routes/notification.routes";
import {fileServer} from "./routes/fileServer.routes";

export function serverRoutes(server: Server) {

    const allRoutes: any = [
        ...fileServer,
        ...authentication,
        ...forgotPassword,
        ...userAccount,
        ...notification,
        ...roles,
        ...test
    ]

    return server.route(allRoutes)

}
