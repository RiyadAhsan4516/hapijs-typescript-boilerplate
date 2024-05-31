"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinEnforcer = exports.authorize = void 0;
const casbin_1 = require("casbin");
const path_1 = require("path");
const boom_1 = require("@hapi/boom");
const data_source_1 = require("../../data-source");
const typedi_1 = require("typedi");
// let enforcer : any;
// newEnforcer(join(__dirname, 'access_model.conf'), join(__dirname, 'access_policy.csv')).then((data : Enforcer )=> enforcer = data);
//
// export async function authorize(sub : string, obj: string, act : string) : Promise<void>{
//     if(! await enforcer.enforce(sub, obj, act)) throw forbidden("you do not have permission to perform this action")
// }
function authorize(sub, obj, act) {
    return __awaiter(this, void 0, void 0, function* () {
        // Initialize a TypeORM adapter and use it in a Node-Casbin enforcer:
        // The adapter can not automatically create database.
        // But the adapter will automatically create and use the table named "casbin_rule".
        // I think ORM should not automatically create databases.
        const e = yield (0, casbin_1.newEnforcer)((0, path_1.join)(__dirname, 'access_model.conf'), data_source_1.casbin_adapter);
        // Load the filtered policy from DB.
        yield e.loadFilteredPolicy({
            'ptype': 'p',
            'v0': 'alice'
        });
        // Check the permission.
        if (!(yield e.enforce(sub, obj, act)))
            throw (0, boom_1.forbidden)("you do not have permission to perform this action");
        // Modify the policy.
        // await e.addPolicy(...);
        // await e.removePolicy(...);
        // Save the policy back to DB.
        yield e.savePolicy();
    });
}
exports.authorize = authorize;
let CasbinEnforcer = class CasbinEnforcer {
    constructor() {
        (0, casbin_1.newEnforcer)((0, path_1.join)(__dirname, 'access_model.conf'), data_source_1.casbin_adapter).then((e) => this.enforcer = e);
    }
    authorize(sub, obj, act) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.enforcer.enforce(sub, obj, act)))
                throw (0, boom_1.forbidden)("you do not have permission to perform this action");
        });
    }
};
exports.CasbinEnforcer = CasbinEnforcer;
exports.CasbinEnforcer = CasbinEnforcer = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CasbinEnforcer);
