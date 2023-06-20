"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetServiceResponse = void 0;
const roleRepository_1 = require("../repositories/roleRepository");
async function GetServiceResponse() {
    const repository = new roleRepository_1.RoleRepository();
    return repository.getAll();
}
exports.GetServiceResponse = GetServiceResponse;
