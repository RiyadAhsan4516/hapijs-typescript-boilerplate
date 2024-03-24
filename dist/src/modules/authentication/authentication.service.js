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
exports.AuthService = void 0;
// THIRD PARTY IMPORTS
const typedi_1 = require("typedi");
const bcryptjs_1 = require("bcryptjs");
const boom_1 = require("@hapi/boom");
// LOCAL IMPORTS
const userAccount_repository_1 = require("../userAccount/userAccount.repository");
const generateTokens_1 = require("../../helpers/generateTokens");
const customValidations_1 = require("../../helpers/customValidations");
const app_1 = require("../../../app");
const authorization_access_1 = require("../authorization/authorization.access");
let AuthService = exports.AuthService = class AuthService {
    logoutUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                accessToken: "",
                refreshToken: ""
            };
        });
    }
    validateLogin(originalData) {
        return __awaiter(this, void 0, void 0, function* () {
            // SET UP INPUT VALIDATION ON ORIGINAL DATA
            let validationCheck = yield new customValidations_1.type_validation.loginInfoJoiValidation;
            let validation_result = yield validationCheck.check(originalData);
            if (validation_result.error)
                throw (0, boom_1.badData)(validation_result.error.details[0].message);
            // "SELECT" OPTION FOR PASSWORD IN USER ENTITY IS SET TO FALSE. CALL A SEPARATE QUERY TO FIND THE USER ALONG WITH THE PASSWORD
            const user = yield typedi_1.Container.get(userAccount_repository_1.UserRepository).getUserWithPassword(originalData.email);
            // THROW ERROR IF NO USER IS FOUND
            if (!user || !(yield (0, bcryptjs_1.compare)(originalData.password, user.password))) {
                throw (0, boom_1.unauthorized)("email or password invalid");
            }
            // TOKEN GENERATION PAYLOAD
            const payload = {
                id: user.id,
                role: user.id,
                rateLimit: 100
            };
            // GENERATE AN ACCESS TOKEN
            const accessToken = yield typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "15m");
            // GENERATE A REFRESH TOKEN
            const refreshToken = yield typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "1d");
            // RETURN THE GENERATED ACCESS AND REFRESH TOKEN
            return { accessToken, refreshToken };
        });
    }
    validateTokenInfo(decoded, token, url, method) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield typedi_1.Container.get(userAccount_repository_1.UserRepository).getOneUser(decoded.id);
            let role;
            // TODO: SET ROLE HERE
            user ? role = user.email : role = "";
            yield (0, authorization_access_1.authorize)(role, url, method);
            let access_tokens = JSON.parse(yield app_1.client.hGet(`tokens-${decoded.id}`, "access"));
            let refresh_tokens = JSON.parse(yield app_1.client.hGet(`tokens-${decoded.id}`, "refresh"));
            if (access_tokens) {
                if (access_tokens.tokens && access_tokens.tokens.includes(token))
                    return { isValid: false };
                if (refresh_tokens && refresh_tokens.tokens && refresh_tokens.tokens.includes(token))
                    return { isValid: false };
            }
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
