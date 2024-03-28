"use strict";
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
exports.tokenRenew = exports.tokenInvalidator = exports.tokenSetup = void 0;
const app_1 = require("../../app");
const boom_1 = require("@hapi/boom");
const typedi_1 = require("typedi");
const generateTokens_1 = require("./generateTokens");
function tokenSetup(tokens, user_id, ip) {
    return __awaiter(this, void 0, void 0, function* () {
        let payload = {
            access: {
                token: tokens.access,
                status: true
            },
            refresh: {
                token: tokens.refresh,
                status: true
            }
        };
        yield app_1.client.hSet(`tokens-${user_id}`, ip, JSON.stringify(payload));
        yield app_1.client.expire(`tokens-${user_id}`, 24 * 60 * 60);
    });
}
exports.tokenSetup = tokenSetup;
function tokenInvalidator(user_id, ip) {
    return __awaiter(this, void 0, void 0, function* () {
        let cached_tokens = JSON.parse(yield app_1.client.hGet(`tokens-${user_id}`, ip));
        if (!cached_tokens)
            throw (0, boom_1.forbidden)("You are not authorized to perform this action");
        let token_list = [cached_tokens.access.token, cached_tokens.refresh.token];
        let invalid_tokens = JSON.parse(yield app_1.client.hGet(`blacklist-${user_id}`, ip));
        if (invalid_tokens && invalid_tokens.length > 0) {
            token_list = [...token_list, ...invalid_tokens];
        }
        yield app_1.client.hSet(`blacklist-${user_id}`, ip, JSON.stringify(token_list));
        yield app_1.client.expire(`blacklist-${user_id}`, 24 * 60 * 60);
    });
}
exports.tokenInvalidator = tokenInvalidator;
function tokenRenew(user, ip) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = {
            id: user.id,
            role: user.role_id.id,
            rateLimit: 100
        };
        const accessToken = yield typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "15m");
        const refreshToken = yield typedi_1.Container.get(generateTokens_1.GenerateTokens).createToken(payload, "1d");
        // SET UP NEW TOKENS IN REDIS
        yield tokenSetup({ access: accessToken, refresh: refreshToken }, user.id, ip);
        return { accessToken, refreshToken };
    });
}
exports.tokenRenew = tokenRenew;
