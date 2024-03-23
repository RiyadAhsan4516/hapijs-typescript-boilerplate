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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const typedi_1 = require("typedi");
const crypto_js_1 = require("crypto-js");
// LOCAL IMPORTS
const authentication_service_1 = require("./authentication.service");
const tokenInvalidator_1 = require("../helpers/tokenInvalidator");
const boom_1 = require("@hapi/boom");
const userAccount_repository_1 = require("../userAccount/userAccount.repository");
const generateTokens_1 = require("../helpers/generateTokens");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let AuthController = exports.AuthController = class AuthController {
    // FEATURE : USER LOGIN
    provideSaltKey(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let saltKey;
            req.query["key"] === "1" ? saltKey = "5425e523c30a45e504780e952d57ed15" : saltKey = 'b2aeffe655c33180cfdc4a949957cb5f';
            return { salt: saltKey };
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
            const result = yield service.validateLogin(originalData);
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
                token: `Bearer ${result.accessToken}`
            };
        });
    }
    generalLogin(req, h) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const service = typedi_1.Container.get(authentication_service_1.AuthService);
            const { email, password } = req.payload;
            const result = yield service.validateLogin({ email, password });
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
            return yield typedi_1.Container.get(authentication_service_1.AuthService).validateTokenInfo(decoded, token, url, method);
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
            // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
            let name = req.headers.origin.split("://")[1].split(".")[0].concat("-refresh");
            let token;
            if (!req.state[name])
                throw (0, boom_1.unauthorized)("you are not authorized to perform this action");
            else
                token = req.state[name];
            if (!token)
                throw (0, boom_1.unauthorized)("you need to login again");
            // @ts-ignore
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
            // Check if user with the id in the decoded token actually exists
            const user = yield typedi_1.Container.get(userAccount_repository_1.UserRepository).getOneUser(decoded.id);
            if (!user)
                return (0, boom_1.unauthorized)("the user of this token does not exist");
            // TODO: SET ROLE ID
            const payload = {
                id: user.id,
                role: user.id,
                rateLimit: 100
            };
            const accessToken = yield typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "15m");
            const refreshToken = yield typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "1d");
            h.state(name, refreshToken, { encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None" });
            return h.response({ token: accessToken }).code(200);
        });
    }
    // FEATURE : LOGOUT USER
    logout(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let user_id = `${req.auth.credentials.id}`;
            let access_token = req.headers.authorization.split(" ")[1];
            // INVALIDATE THE ACCESS TOKEN AND SET THE EXPIRY TIME FOR 1 DAY
            yield (0, tokenInvalidator_1.invalidateToken)(access_token, user_id, "access");
            // CALL AUTH SERVICE AND LOGOUT THE USER
            const service = typedi_1.Container.get(authentication_service_1.AuthService);
            const result = yield service.logoutUser();
            // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
            let name = req.headers.origin.split("://")[1].split(".")[0].concat(`-refresh`);
            // INVALIDATE THE PREVIOUSLY SET UP REFRESH TOKEN
            let refresh_token = req.state[name];
            if (refresh_token)
                yield (0, tokenInvalidator_1.invalidateToken)(refresh_token, user_id, "refresh");
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
exports.AuthController = AuthController = __decorate([
    (0, typedi_1.Service)()
], AuthController);
