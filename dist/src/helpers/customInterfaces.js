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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.type_validation = void 0;
const joi_1 = __importDefault(require("joi"));
var type_validation;
(function (type_validation) {
    class loginInfoJoiValidation {
        check(obj) {
            return __awaiter(this, void 0, void 0, function* () {
                const schema = joi_1.default.object({
                    email: joi_1.default.string()
                        .required()
                        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } })
                        .messages({
                        'string.base': "email should be of type string",
                        'string.email': "email format is incorrect",
                        'string.required': "email is not provided"
                    }),
                    password: joi_1.default.string()
                        .required()
                        .min(8)
                        .messages({
                        'string.base': "password has to be a string",
                        'string.required': "password is not provided",
                        'string.min': "password minimum length is 8"
                    })
                });
                return schema.validate(obj, { abortEarly: false });
            });
        }
    }
    type_validation.loginInfoJoiValidation = loginInfoJoiValidation;
})(type_validation || (exports.type_validation = type_validation = {}));
