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
const authentication_service_1 = require("./authentication.service");
let AuthController = class AuthController {
    // FEATURE : USER LOGIN
    provideSaltKey(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let saltKey;
            req.query["key"] === "1" ? saltKey = "5425e523c30a45e504780e952d57ed15" : saltKey = 'b2aeffe655c33180cfdc4a949957cb5f';
            return h.response({ salt: saltKey }).code(200);
        });
    }
    saltLogin(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = typedi_1.Container.get(authentication_service_1.AuthService);
            //@ts-ignore
            const { data } = req.payload;
            // DECRYPT THE DATA AND EXTRACT THE EMAIL AND PASSWORD
            const bytes = crypto_js_1.AES.decrypt(data, "5425e523c30a45e504780e952d57ed15");
            const originalData = JSON.parse(bytes.toString(crypto_js_1.enc.Utf8));
            // SEND DECRYPTED DATA TO SERVICE TO COMPLETE VALIDATION.
            const result = yield service.validateLogin(originalData, req.info.remoteAddress);
            // SET THE COOKIE WITH NECESSARY OPTIONS
            h.state('refresh', result.refreshToken, {
                encoding: 'none',
                isSecure: true,
                isHttpOnly: true,
                isSameSite: "None"
            });
            // ENCRYPT THE ACCESS TOKEN
            let accessToken = crypto_js_1.AES.encrypt(result.accessToken, 'b2aeffe655c33180cfdc4a949957cb5f').toString();
            // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
            return {
                message: "Login successful",
                token: `Bearer ${accessToken}`
            };
        });
    }
    generalLogin(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const service = typedi_1.Container.get(authentication_service_1.AuthService);
            const { email, password } = req.payload;
            const result = yield service.validateLogin({ email, password }, req.info.remoteAddress);
            // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
            let name = (_a = req.headers.origin) === null || _a === void 0 ? void 0 : _a.split("://")[1].split(".")[0].concat(`-refresh`);
            // SET THE COOKIE WITH NECESSARY OPTIONS
            h.state(name, result.refreshToken, { encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None" });
            // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
            return h.response({
                message: "Login successful",
                token: `${result.accessToken}`
            }).code(200);
        });
    }
    // FEATURE : CHECK LOGGED IN USER
    isLoggedIn(decoded, req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = req.headers.authorization.split(" ")[1];
            let url = `/api${req.url.href.split("api")[1]}`;
            let method = req.method;
            return yield typedi_1.Container.get(authentication_service_1.AuthService).validateTokenInfo(decoded, token, url, method, req.info.remoteAddress);
        });
    }
    staticTokenValidator(req, token, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            token === process.env.STATIC ? result = { isValid: true, credentials: {} } : result = {
                isValid: false,
                credentials: {}
            };
            return result;
        });
    }
    // FEATURE: TAKE REFRESH TOKEN
    refreshToken(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = typedi_1.Container.get(authentication_service_1.AuthService);
            // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
            let name = req.headers.origin.split("://")[1].split(".")[0].concat("-refresh");
            let payload = yield service.refreshToken(req.state[name], req.info.remoteAddress);
            h.state(name, payload.refreshToken, { encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None" });
            return h.response({ token: payload.accessToken }).code(200);
        });
    }
    // FEATURE : LOGOUT USER
    logout(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let user_id = `${req.auth.credentials.id}`;
            // let access_token: string = req.headers.authorization.split(" ")[1]
            // CALL AUTH SERVICE AND LOGOUT THE USER
            const service = typedi_1.Container.get(authentication_service_1.AuthService);
            const result = yield service.logoutUser(user_id, req.info.remoteAddress);
            // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
            let name = req.headers.origin.split("://")[1].split(".")[0].concat(`-refresh`);
            // SET THE COOKIE WITH NECESSARY OPTIONS
            h.state(name, result.refreshToken, { encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None" });
            // RETURN THE ACCESS TOKEN ALONG WITH A MESSAGE
            return h.response({
                message: "Logged out!",
                token: `${result.accessToken}`
            }).unstate(name);
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, typedi_1.Service)()
], AuthController);
