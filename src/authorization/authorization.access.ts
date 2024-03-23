import {Enforcer, newEnforcer} from "casbin";
import {join} from "path"
import {forbidden} from "@hapi/boom";

let enforcer : any;
newEnforcer(join(__dirname, 'access_model.conf'), join(__dirname, 'access_policy.csv')).then((data : Enforcer )=> enforcer = data);

export async function authorize(role : any, url: string, method : string) : Promise<void>{

    if(await enforcer.enforce(role, url, method.toUpperCase())) {
        return
    }
    else {
        throw forbidden("You are not authorized to perform this action")
    }
}
