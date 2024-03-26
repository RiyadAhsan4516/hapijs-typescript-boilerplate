"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidations = void 0;
const joi_1 = __importDefault(require("joi"));
const boom_1 = require("@hapi/boom");
exports.inputValidations = {
    paginationParam: joi_1.default.object({
        limit: joi_1.default.number().min(1).error((0, boom_1.badRequest)("limit parameter cannot be less than 1")),
        pageNo: joi_1.default.number().min(1).error((0, boom_1.badRequest)("pageNo parameter cannot be less than 1"))
    }),
    idParam: joi_1.default.object({
        id: joi_1.default.string().alphanum().required().error((0, boom_1.badData)("id sent in param is not valid"))
    })
};
