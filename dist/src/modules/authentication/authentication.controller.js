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
const tokenInvalidator_1 = require("../../helpers/tokenInvalidator");
const boom_1 = require("@hapi/boom");
const userAccount_repository_1 = require("../userAccount/userAccount.repository");
const generateTokens_1 = require("../../helpers/generateTokens");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const promises_1 = __importDefault(require("fs/promises"));
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
            // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
            let name;
            if (req.headers.origin)
                name = req.headers.origin.split("://")[1].split(".")[0].concat("-refresh");
            else
                name = "127.0.0.1-refresh";
            let token;
            if (!req.state[name])
                throw (0, boom_1.unauthorized)("you are not authorized to perform this action");
            else
                token = req.state[name];
            if (!token)
                throw (0, boom_1.unauthorized)("you need to login again");
            // VERIFY TOKEN USING RS256 PUBLIC KEY
            let cert = yield promises_1.default.readFile("./../../../public_key.pem", "utf8");
            let decoded;
            yield jsonwebtoken_1.default.verify(token, cert, (err, decode) => {
                if (!err)
                    decoded = decode;
                else
                    throw (0, boom_1.forbidden)("you are not authorized to perform this action");
            });
            // Check if user with the id in the decoded token actually exists
            const user = yield typedi_1.Container.get(userAccount_repository_1.UserRepository).getOneUser(decoded.id);
            if (!user)
                return (0, boom_1.unauthorized)("the user of this token does not exist");
            // INVALIDATE THE PREVIOUS TOKENS HERE
            yield (0, tokenInvalidator_1.tokenInvalidator)(user.id, req.info.remoteAddress);
            // CREATE NEW TOKENS
            const payload = {
                id: user.id,
                role: user.role_id.id,
                rateLimit: 100
            };
            const accessToken = yield typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "15m");
            const refreshToken = yield typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "1d");
            // SET UP NEW TOKENS
            yield (0, tokenInvalidator_1.tokenSetup)({ access: accessToken, refresh: refreshToken }, user.id, req.info.remoteAddress);
            h.state(name, refreshToken, { encoding: 'none', isSecure: true, isHttpOnly: true, isSameSite: "None" });
            return h.response({ token: accessToken }).code(200);
        });
    }
    // FEATURE : LOGOUT USER
    logout(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let user_id = `${req.auth.credentials.id}`;
            let access_token = req.headers.authorization.split(" ")[1];
            // CALL AUTH SERVICE AND LOGOUT THE USER
            const service = typedi_1.Container.get(authentication_service_1.AuthService);
            const result = yield service.logoutUser(user_id, req.info.remoteAddress);
            // SET NAME OF THE REFRESH COOKIE ACCORDING TO THE ORIGIN
            let name;
            if (req.headers.origin)
                name = req.headers.origin.split("://")[1].split(".")[0].concat(`-refresh`);
            else
                name = "127.0.0.1-refresh";
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
