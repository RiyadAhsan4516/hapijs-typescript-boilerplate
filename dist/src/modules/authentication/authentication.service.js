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
exports.AuthService = void 0;
// THIRD PARTY IMPORTS
const typedi_1 = require("typedi");
const bcryptjs_1 = require("bcryptjs");
const boom_1 = require("@hapi/boom");
// LOCAL IMPORTS
const userAccount_repository_1 = require("../userAccount/userAccount.repository");
const customInterfaces_1 = require("../../helpers/customInterfaces");
const app_1 = require("../../../app");
const tokenCache_1 = require("../../helpers/tokenCache");
const promises_1 = __importDefault(require("fs/promises"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let AuthService = class AuthService {
    logoutUser(user_id, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            // INVALIDATE THE TOKENS (NEW FORMAT)
            yield (0, tokenCache_1.tokenInvalidator)(+user_id, ip);
            return {
                accessToken: "",
                refreshToken: ""
            };
        });
    }
    validateLogin(originalData, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            // SET UP INPUT VALIDATION ON ORIGINAL DATA
            let validationCheck = yield new customInterfaces_1.type_validation.loginInfoJoiValidation;
            let validation_result = yield validationCheck.check(originalData);
            if (validation_result.error)
                throw (0, boom_1.badData)(validation_result.error.details[0].message);
            // "SELECT" OPTION FOR PASSWORD IN USER ENTITY IS SET TO FALSE. CALL A SEPARATE QUERY TO FIND THE USER ALONG WITH THE PASSWORD
            const user = yield typedi_1.Container.get(userAccount_repository_1.UserRepository).getUserWithPassword(originalData.email);
            // THROW ERROR IF NO USER IS FOUND
            if (!user || !(yield (0, bcryptjs_1.compare)(originalData.password, user.password))) {
                throw (0, boom_1.unauthorized)("email or password invalid");
            }
            // RETURN THE GENERATED ACCESS AND REFRESH TOKEN
            return yield (0, tokenCache_1.tokenRenew)(user, ip);
        });
    }
    validateTokenInfo(decoded, token, url, method, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield typedi_1.Container.get(userAccount_repository_1.UserRepository).getOneUser(decoded.id);
            let role;
            let blacklisted_tokens = JSON.parse(yield app_1.client.hGet(`blacklist-${decoded.id}`, ip));
            if (blacklisted_tokens) {
                if (blacklisted_tokens.includes(token))
                    return { isValid: false };
            }
            if (!user)
                return { isValid: false };
            else
                return { isValid: true };
        });
    }
    refreshToken(refresh_token, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            let token;
            if (!refresh_token)
                throw (0, boom_1.unauthorized)("you are not authorized to perform this action");
            else
                token = refresh_token;
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
            // CHECK IF USER WITH THIS ID FOUND FROM DECODING ACTUALLY EXISTS
            const user = yield typedi_1.Container.get(userAccount_repository_1.UserRepository).getOneUser(decoded.id);
            if (!user)
                throw (0, boom_1.unauthorized)("the user of this token does not exist");
            // INVALIDATE THE PREVIOUS TOKENS HERE
            yield (0, tokenCache_1.tokenInvalidator)(user.id, ip);
            // CREATE AND RETURN NEW TOKENS
            return yield (0, tokenCache_1.tokenRenew)(user, ip);
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, typedi_1.Service)()
], AuthService);
