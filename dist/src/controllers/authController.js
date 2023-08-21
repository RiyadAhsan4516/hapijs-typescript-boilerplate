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
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const typedi_1 = require("typedi");
let AuthController = exports.AuthController = class AuthController {
    login(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = typedi_1.Container.get(authService_1.AuthService);
            const { email, password } = req.payload;
            const result = yield service.validateLogin(email, password);
            // SET THE COOKIE WITH NECESSARY OPTIONS
            h.state('refresh', result.refreshToken, { encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None" });
            // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
            return {
                message: "Login successful",
                token: `Bearer ${result.accessToken}`
            };
        });
    }
    isLoggedIn(decoded, req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typedi_1.Container.get(authService_1.AuthService).validateTokenInfo(decoded);
        });
    }
};
exports.AuthController = AuthController = __decorate([
    (0, typedi_1.Service)()
], AuthController);
