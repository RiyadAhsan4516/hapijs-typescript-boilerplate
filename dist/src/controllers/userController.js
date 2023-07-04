"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UserController = void 0;
const typedi_1 = require("typedi");
const userService_1 = require("../services/userService");
const boom_1 = require("@hapi/boom");
let UserController = exports.UserController = class UserController {
    getUsers(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = typedi_1.Container.get(userService_1.UserService);
            let result = yield service.getAll();
            if (!result || result.length < 1)
                throw new boom_1.Boom("no users found", { statusCode: 404 });
            return result;
        });
    }
    getUser(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = typedi_1.Container.get(userService_1.UserService);
            let id = req.params.id;
            let result = yield service.getOne(id);
            if (!result)
                throw new boom_1.Boom("no user found with this id", { statusCode: 404 });
            return result;
        });
    }
    CreateUser(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = typedi_1.Container.get(userService_1.UserService);
            let inputs;
            if (typeof req.payload === 'string')
                throw new boom_1.Boom("payload has to be an object", { statusCode: 400 });
            else
                inputs = Object.assign({}, req.payload);
            let result = yield service.createUser(inputs);
            if (!result || result.length < 1) {
                throw new boom_1.Boom("No data found", { statusCode: 404 });
            }
            return result;
        });
    }
    UpdateUser(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = typedi_1.Container.get(userService_1.UserService);
            let inputs;
            if (typeof req.payload === 'string')
                throw new boom_1.Boom("payload has to be an object", { statusCode: 400 });
            else
                inputs = Object.assign({}, req.payload);
            return yield service.updateUser(inputs, req.params.id);
        });
    }
};
exports.UserController = UserController = __decorate([
    (0, typedi_1.Service)()
], UserController);
