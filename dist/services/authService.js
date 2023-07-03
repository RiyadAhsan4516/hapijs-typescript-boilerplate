"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const typedi_1 = require("typedi");
const boom_1 = require("@hapi/boom");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userRepository_1 = require("../repositories/userRepository");
const generateTokens_1 = require("../helpers/generateTokens");
let AuthService = exports.AuthService = class AuthService {
    async validateLogin(email, password) {
        // "SELECT" OPTION FOR PASSWORD IN USER ENTITY IS SET TO FALSE. CALL A SEPARATE QUERY TO FIND THE USER ALONG WITH THE PASSWORD
        const user = await typedi_1.Container.get(userRepository_1.UserRepository).getUserWithPassword(email);
        // THROW ERROR IF NO USER IS FOUND
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            throw new boom_1.Boom("email or password invalid", { statusCode: 401 });
        }
        // GENERATE AN ACCESS TOKEN WITH TYPE 'ACCESS'
        const payload = {
            id: user.id,
            type: 'access'
        };
        const accessToken = await typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "15m");
        // GENERATE A REFRESH TOKEN WITH TYPE 'REFRESH'
        payload.type = "refresh";
        const refreshToken = await typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "1d");
        // RETURN THE GENERATED ACCESS AND REFRESH TOKEN
        return { accessToken, refreshToken };
    }
    async validateTokenInfo(decoded) {
        const user = await typedi_1.Container.get(userRepository_1.UserRepository).getOneUser(decoded.id);
        if (!user)
            return { isValid: false };
        else
            return { isValid: true };
    }
};
exports.AuthService = AuthService = __decorate([
    (0, typedi_1.Service)()
], AuthService);
