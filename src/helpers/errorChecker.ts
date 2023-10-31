import {methodNotAllowed} from "@hapi/boom";

export function methodTypeCheck(req_type: string, expected_type: string) : void {
    if(req_type!==expected_type)
        throw methodNotAllowed(`${req_type} method not allowed on this route`)
}
