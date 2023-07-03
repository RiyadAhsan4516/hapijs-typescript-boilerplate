"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const typedi_1 = require("typedi");
const userService_1 = require("../services/userService");
const boom_1 = require("@hapi/boom");
let UserController = exports.UserController = class UserController {
    async getUsers(req, h) {
        let service = typedi_1.Container.get(userService_1.UserService);
        let result = await service.getAll();
        if (!result || result.length < 1)
            throw new boom_1.Boom("no users found", { statusCode: 404 });
        return result;
    }
    async getUser(req, h) {
        let service = typedi_1.Container.get(userService_1.UserService);
        let id = req.params.id;
        let result = await service.getOne(id);
        if (!result)
            throw new boom_1.Boom("no user found with this id", { statusCode: 404 });
        return result;
    }
    async CreateUser(req, h) {
        let service = typedi_1.Container.get(userService_1.UserService);
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
        let service = typedi_1.Container.get(userService_1.UserService);
        let inputs;
        if (typeof req.payload === 'string')
            throw new boom_1.Boom("payload has to be an object", { statusCode: 400 });
        else
            inputs = { ...req.payload };
        return await service.updateUser(inputs, req.params.id);
    }
};
exports.UserController = UserController = __decorate([
    (0, typedi_1.Service)()
], UserController);
