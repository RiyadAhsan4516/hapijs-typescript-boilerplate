"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const typedi_1 = require("typedi");
let GenerateTokens = exports.GenerateTokens = class GenerateTokens {
    async createToken(payload, expire) {
        return jsonwebtoken_1.default.sign(payload, `${process.env.SECRET}`, {
            expiresIn: expire,
        });
    }
};
exports.GenerateTokens = GenerateTokens = __decorate([
    (0, typedi_1.Service)()
], GenerateTokens);
