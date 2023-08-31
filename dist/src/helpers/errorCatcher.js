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
exports.errorCatcher = void 0;
const boom_1 = require("@hapi/boom");
function errorCatcher(fn) {
    return (req, h) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn(req, h);
        }
        catch (err) {
            throw new boom_1.Boom("something went wrong", { statusCode: 500 });
        }
    });
}
exports.errorCatcher = errorCatcher;
