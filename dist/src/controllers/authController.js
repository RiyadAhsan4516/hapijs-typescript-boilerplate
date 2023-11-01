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
const typedi_1 = require("typedi");
const crypto_js_1 = require("crypto-js");
// LOCAL IMPORTS
const authService_1 = require("../services/authService");
const errorChecker_1 = require("../helpers/errorChecker");
let AuthController = exports.AuthController = class AuthController {
    provideSaltKey(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, errorChecker_1.methodTypeCheck)(req.method, 'get');
            let saltKey;
            req.query["key"] === "1" ? saltKey = "5425e523c30a45e504780e952d57ed15" : saltKey = 'b2aeffe655c33180cfdc4a949957cb5f';
            return { salt: saltKey };
        });
    }
    saltLogin(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = typedi_1.Container.get(authService_1.AuthService);
            //@ts-ignore
            const { data } = req.payload;
            // DECRYPT THE DATA AND EXTRACT THE EMAIL AND PASSWORD
            const bytes = crypto_js_1.AES.decrypt(data, "5425e523c30a45e504780e952d57ed15");
            const originalData = JSON.parse(bytes.toString(crypto_js_1.enc.Utf8));
            // SEND DECRYPTED DATA TO SERVICE TO COMPLETE VALIDATION.
            const result = yield service.validateLogin(originalData);
            // SET THE COOKIE WITH NECESSARY OPTIONS
            h.state('refresh', result.refreshToken, { encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None" });
            // ENCRYPT THE ACCESS TOKEN
            let accessToken = crypto_js_1.AES.encrypt(result.accessToken, 'b2aeffe655c33180cfdc4a949957cb5f').toString();
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
    staticTokenValidator(req, token, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            token === process.env.STATIC ? result = { isValid: true, credentials: {} } : result = { isValid: false, credentials: {} };
            return result;
        });
    }
};
exports.AuthController = AuthController = __decorate([
    (0, typedi_1.Service)()
], AuthController);
