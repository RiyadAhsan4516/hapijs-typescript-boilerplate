"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const roleService_1 = require("../services/roleService");
const boom_1 = require("@hapi/boom");
class RoleController {
    async getRole(req, h) {
        let result = await (0, roleService_1.GetServiceResponse)();
        if (!result || result.length < 1) {
            throw new boom_1.Boom("nothing found", { statusCode: 404 });
        }
        return result;
    }
}
exports.RoleController = RoleController;
