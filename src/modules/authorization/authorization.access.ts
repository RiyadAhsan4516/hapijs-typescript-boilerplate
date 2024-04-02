import {Enforcer, newEnforcer} from "casbin";
import {join} from "path"
import {forbidden} from "@hapi/boom";

let enforcer : any;
newEnforcer(join(__dirname, 'access_model.conf'), join(__dirname, 'access_policy.csv')).then((data : Enforcer )=> enforcer = data);

export async function authorize(sub : string, obj: string, act : string) : Promise<void>{
    if(! await enforcer.enforce(sub, obj, act)) throw forbidden("you do not have permission to perform this action")
}
