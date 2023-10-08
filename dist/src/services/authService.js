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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const typedi_1 = require("typedi");
const Boom = __importStar(require("@hapi/boom"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userRepository_1 = require("../repositories/userRepository");
const generateTokens_1 = require("../helpers/generateTokens");
let AuthService = exports.AuthService = class AuthService {
    validateLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // "SELECT" OPTION FOR PASSWORD IN USER ENTITY IS SET TO FALSE. CALL A SEPARATE QUERY TO FIND THE USER ALONG WITH THE PASSWORD
            const user = yield typedi_1.Container.get(userRepository_1.UserRepository).getUserWithPassword(email);
            // THROW ERROR IF NO USER IS FOUND
            if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
                throw Boom.unauthorized("email or password invalid");
            }
            // GENERATE AN ACCESS TOKEN WITH TYPE 'ACCESS'
            const payload = {
                id: user.id,
                type: 'access'
            };
            const accessToken = yield typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "15m");
            // GENERATE A REFRESH TOKEN WITH TYPE 'REFRESH'
            payload.type = "refresh";
            const refreshToken = yield typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "1d");
            // RETURN THE GENERATED ACCESS AND REFRESH TOKEN
            return { accessToken, refreshToken };
        });
    }
    validateTokenInfo(decoded) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield typedi_1.Container.get(userRepository_1.UserRepository).getOneUser(decoded.id);
            if (!user)
                return { isValid: false };
            else
                return { isValid: true };
        });
    }
};
exports.AuthService = AuthService = __decorate([
    (0, typedi_1.Service)()
], AuthService);
