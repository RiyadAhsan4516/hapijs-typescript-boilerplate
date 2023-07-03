"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const typedi_1 = require("typedi");
let AuthController = exports.AuthController = class AuthController {
    async login(req, h) {
        const service = typedi_1.Container.get(authService_1.AuthService);
        // @ts-ignore
        const { email, password } = req.payload;
        const result = await service.validateLogin(email, password);
        // SET THE COOKIE WITH NECESSARY OPTIONS
        h.state('jwt', result.refreshToken, { encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None" });
        // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
        return {
            message: "Login successful",
            token: `Bearer ${result.accessToken}`
        };
    }
    async isLoggedIn(decoded, req, h) {
        return await typedi_1.Container.get(authService_1.AuthService).validateTokenInfo(decoded);
    }
};
exports.AuthController = AuthController = __decorate([
    (0, typedi_1.Service)()
], AuthController);
