import {Enforcer, newEnforcer} from "casbin";
import {join} from "path"
import {forbidden} from "@hapi/boom";
import {casbin_adapter} from "../../data-source";

// let enforcer : any;
// newEnforcer(join(__dirname, 'access_model.conf'), join(__dirname, 'access_policy.csv')).then((data : Enforcer )=> enforcer = data);
//
// export async function authorize(sub : string, obj: string, act : string) : Promise<void>{
//     if(! await enforcer.enforce(sub, obj, act)) throw forbidden("you do not have permission to perform this action")
// }


export async function authorize(sub : string, obj: string, act : string) {
    // Initialize a TypeORM adapter and use it in a Node-Casbin enforcer:
    // The adapter can not automatically create database.
    // But the adapter will automatically create and use the table named "casbin_rule".
    // I think ORM should not automatically create databases.

    const e: Enforcer = await newEnforcer(join(__dirname, 'access_model.conf'), casbin_adapter);

    // Load the filtered policy from DB.
    await e.loadFilteredPolicy({
        'ptype': 'p',
        'v0': 'alice'
    });

    // Check the permission.
    if(! await e.enforce(sub, obj, act)) throw forbidden("you do not have permission to perform this action")

    // Modify the policy.
    // await e.addPolicy(...);
    // await e.removePolicy(...);

    // Save the policy back to DB.
    await e.savePolicy();
}
