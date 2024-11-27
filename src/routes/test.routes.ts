import {errorCatcher} from "../helpers/errorCatcher";
import {Container} from "typedi";
import {multipartConfig} from "../config/multipartConfiguration";
import {ReqRefDefaults, ResponseToolkit} from "@hapi/hapi";
import {fileProcessor} from "../helpers/fileProcessor";
import {imageResizer} from "../helpers/imageResizer";
import {TestController} from "../modules/test/test.controller";


export const test = [
    {
        method: "POST",
        path: `/api/v1/test-image-resizer`,
        options: {
            payload: multipartConfig(3, 60000)
        },
        handler: errorCatcher(async function(req: any, h:ResponseToolkit<ReqRefDefaults>){
            const {payload} = req
            if (payload.profile_photo) payload.profile_photo = await fileProcessor(payload.profile_photo, ["jpeg", "png"], 3000000, "profile");
            return await imageResizer({width: 100, height: 100}, payload.profile_photo)
            // return h.response(req.info.remoteAddress)
        })
    },
    {
        method: "POST",
        path: `/api/v1/upload-test`,
        options: {
            payload: multipartConfig(2, 60000)
        },
        handler: errorCatcher(Container.get(TestController).upload)
    },
    {
        method: "*",
        path: `/api/v1/test`,
        handler: errorCatcher(Container.get(TestController).getAll)
    },
]
