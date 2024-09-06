import {Enforcer, newEnforcer} from "casbin";
import {join} from "path"
import {forbidden} from "@hapi/boom";
import {casbin_adapter} from "../../data-source";
import {Service} from "typedi";

@Service()
export class CasbinEnforcer {
    public enforcer: Enforcer

    async checkAuthorization(sub: string, obj: string, act: string): Promise<void> {

        await newEnforcer(join(__dirname, '../', '../', '../', 'access_model.conf'), casbin_adapter).then((e: Enforcer) => this.enforcer = e)

        // STEP 1 : LOAD THE FILTERED POLICY HERE
        await this.enforcer.loadFilteredPolicy({
            'ptype': 'p',
            'v0': sub,
            'v1': obj
        })

        // STEP 2 : CHECK PERMISSION
        if (!await this.enforcer.enforce(sub, obj, act))
            throw forbidden("Access Denied")
    }

    async addRemovePolicy(sub: string, obj: string, act: string, actionType: 0 | 1): Promise<void> {
        await newEnforcer(join(__dirname, '../', '../', '../', 'access_model.conf'), casbin_adapter).then((e: Enforcer) => this.enforcer = e)

        // ACTION TYPE 1 MEANS ADD POLICY
        if (actionType === 1) {
            await this.enforcer.addPolicy(sub, obj, act)
        } else {
            await this.enforcer.removePolicy(sub, obj, act)
        }

        // FINALLY SAVE THE UPDATED POLICY
        await this.enforcer.savePolicy();

    }
}
