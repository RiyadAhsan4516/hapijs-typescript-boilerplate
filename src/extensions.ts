import {ReqRefDefaults, ResponseObject, ResponseToolkit} from "@hapi/hapi";

export interface ResponseType extends ResponseToolkit<ReqRefDefaults> {
    success(result: any, code: number): Promise<ResponseObject>
}