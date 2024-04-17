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
const userAccount_service_1 = require("./userAccount.service");
const Boom = __importStar(require("@hapi/boom"));
const payloadFormatter_1 = require("../../helpers/payloadFormatter");
const authorization_access_1 = require("../authorization/authorization.access");
let UserController = class UserController {
    getUsers(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            // CALL CASBIN AUTHORIZE FUNCTION INSIDE THE CONTROLLER
            yield (0, authorization_access_1.authorize)(`${req.auth.credentials.role}`, 'userList', "read");
            let limit = +req.params.limit;
            let pageNo = +req.params.pageNo;
            let params = Object.assign({}, req.query);
            let service = typedi_1.Container.get(userAccount_service_1.UserService);
            let result = yield service.getAll(limit, pageNo, params);
            if (!result || result.total_count < 1)
                return h.response("No data found").code(204);
            return h.response(yield (0, payloadFormatter_1.payloadFormatter)(result)).code(200);
        });
    }
    getUser(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = +req.params.id;
            let service = typedi_1.Container.get(userAccount_service_1.UserService);
            let result = yield service.getOne(id);
            if (!result)
                return h.response("No user found with this id").code(204);
            return h.response(yield (0, payloadFormatter_1.payloadFormatter)(result)).code(200);
        });
    }
    CreateUser(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            let payload = Object.assign({}, req.payload);
            let service = typedi_1.Container.get(userAccount_service_1.UserService);
            let result = yield service.createUser(payload);
            if (!result || result.length < 1) {
                return h.response("No data found").code(204);
            }
            return h.response(yield (0, payloadFormatter_1.payloadFormatter)(result)).code(201);
        });
    }
    UpdateUser(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = typedi_1.Container.get(userAccount_service_1.UserService);
            let inputs;
            if (typeof req.payload === 'string')
                throw Boom.badData("payload has to be an object");
            else
                inputs = Object.assign({}, req.payload);
            return yield service.updateUser(inputs, req.params.id);
        });
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, typedi_1.Service)()
], UserController);
