import {Enforcer, newEnforcer} from "casbin";
import {join} from "path"
import {forbidden} from "@hapi/boom";
import {casbin_adapter} from "../../data-source";
import {Service} from "typedi";

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

@Service()
export class CasbinEnforcer {
    private enforcer : Enforcer

    constructor() {
        newEnforcer(join(__dirname, 'access_model.conf'), casbin_adapter).then((e: Enforcer)=> this.enforcer = e)
    }

    async checkAuthorization(sub : string, obj: string, act : string): Promise<void>{
        // STEP 1 : LOAD THE FILTERED POLICY HERE
        await this.enforcer.loadFilteredPolicy({
            'ptype': 'p',
            'v0' : sub,
            'v1' : obj
        })

        // STEP 2 : CHECK PERMISSION
        if(! await this.enforcer.enforce(sub, obj, act)) throw forbidden("you do not have permission to perform this action")
    }

    async addPolicy(sub: string, obj: string, act: string) : Promise<void> {
        await this.enforcer.addPolicy(sub, obj, act)
        await this.savePolicy();
    }

    async removePolicy(sub: string, obj: string, act: string) : Promise<void> {
        await this.enforcer.removePolicy(sub, obj, act)
        await this.savePolicy();
    }

    async savePolicy() : Promise<void> {
        await this.enforcer.savePolicy();
    }
}
