"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
const boom_1 = require("@hapi/boom");
class UserController {
    async getUsers(req, h) {
        let service = new userService_1.UserService();
        let result = await service.getAll();
        if (!result || result.length < 1)
            throw new boom_1.Boom("no users found", { statusCode: 404 });
        return result;
    }
    async getUser(req, h) {
        let service = new userService_1.UserService();
        let id = req.params.id;
        let result = await service.getOne(id);
        if (!result)
            throw new boom_1.Boom("no user found with this id", { statusCode: 404 });
        return result;
    }
    async CreateUser(req, h) {
        let service = new userService_1.UserService();
        let inputs;
        if (typeof req.payload === 'string')
            throw new boom_1.Boom("payload has to be an object", { statusCode: 400 });
        else
            inputs = { ...req.payload };
        let result = await service.createUser(inputs);
        if (!result || result.length < 1) {
            throw new boom_1.Boom("No data found", { statusCode: 404 });
        }
        return result;
    }
    async UpdateUser(req, h) {
        let service = new userService_1.UserService();
        let inputs;
        if (typeof req.payload === 'string')
            throw new boom_1.Boom("payload has to be an object", { statusCode: 400 });
        else
            inputs = { ...req.payload };
        let result = await service.updateUser(inputs, req.params.id);
        return result;
    }
}
exports.UserController = UserController;
