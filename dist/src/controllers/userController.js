"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const Boom = __importStar(require("@hapi/boom"));
let UserController = exports.UserController = class UserController {
    getUsers(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = typedi_1.Container.get(userService_1.UserService);
            let result = yield service.getAll();
            if (!result || result.length < 1)
                return h.response("No data found").code(204);
            return result;
        });
    }
    getUser(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = typedi_1.Container.get(userService_1.UserService);
            let id = req.params.id;
            let result = yield service.getOne(id);
            if (!result)
                return h.response("No user found with this id").code(204);
            return result;
        });
    }
    CreateUser(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = typedi_1.Container.get(userService_1.UserService);
            let inputs;
            if (typeof req.payload === 'string')
                throw Boom.badData("payload has to be an object");
            else
                inputs = Object.assign({}, req.payload);
            let result = yield service.createUser(inputs);
            if (!result || result.length < 1) {
                return h.response("No data found").code(204);
            }
            return result;
        });
    }
    UpdateUser(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = typedi_1.Container.get(userService_1.UserService);
            let inputs;
            if (typeof req.payload === 'string')
                throw Boom.badData("payload has to be an object");
            else
                inputs = Object.assign({}, req.payload);
            return yield service.updateUser(inputs, req.params.id);
        });
    }
};
exports.UserController = UserController = __decorate([
    (0, typedi_1.Service)()
], UserController);
