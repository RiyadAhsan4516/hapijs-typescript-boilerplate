import * as Boom from '@hapi/boom'

export function methodTypeCheck(req_type: string, expected_type: string){
    if(req_type!==expected_type) throw Boom.methodNotAllowed(`${req_type} method not allowed on this route`)
}
