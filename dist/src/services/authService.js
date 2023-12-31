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
const userRepository_1 = require("../repositories/userRepository");
const generateTokens_1 = require("../helpers/generateTokens");
const customValidations_1 = require("../helpers/customValidations");
let AuthService = exports.AuthService = class AuthService {
    validateLogin(originalData) {
        return __awaiter(this, void 0, void 0, function* () {
            // SET UP INPUT VALIDATION ON ORIGINAL DATA
            let validationCheck = yield new customValidations_1.type_validation.loginInfoJoiValidation;
            let validation_result = yield validationCheck.check(originalData);
            if (validation_result.error)
                throw (0, boom_1.badData)(validation_result.error.details[0].message);
            // "SELECT" OPTION FOR PASSWORD IN USER ENTITY IS SET TO FALSE. CALL A SEPARATE QUERY TO FIND THE USER ALONG WITH THE PASSWORD
            const user = yield typedi_1.Container.get(userRepository_1.UserRepository).getUserWithPassword(originalData.email);
            // THROW ERROR IF NO USER IS FOUND
            if (!user || !(yield (0, bcryptjs_1.compare)(originalData.password, user.password))) {
                throw (0, boom_1.unauthorized)("email or password invalid");
            }
            // GENERATE AN ACCESS TOKEN WITH TYPE SET TO 'access'
            const payload = {
                id: user.id,
                type: 'access'
            };
            const accessToken = yield typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "15m");
            // GENERATE A REFRESH TOKEN WITH TYPE SET TO 'refresh'
            payload.type = "refresh";
            const refreshToken = yield typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "1d");
            // TODO: SET THE TOKENS IN REDIS ALONG WITH USER ID
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
