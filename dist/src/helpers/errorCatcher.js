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
function errorPayload(statusCode, error, message) {
    return __awaiter(this, void 0, void 0, function* () {
        return { statusCode, error, message };
    });
}
function errorCatcher(fn) {
    return (req, h) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn(req, h);
        }
        catch (err) {
            if (process.env.NODE_ENV == "development")
                console.log(err);
            if (err.isBoom)
                return h.response(err.output.payload).code(err.output.statusCode);
            else if (err.sqlState && err.errno == 1062)
                return h.response(yield errorPayload(400, "bad request", "duplicate entry found")).code(400);
            else if (err.sqlState && err.errno == 1451)
                return h.response(yield errorPayload(400, "bad request", "cannot add/update/delete due to foreign key constraint")).code(400);
            else if (err.sqlState && err.errno)
                return h.response(yield errorPayload(422, "unprocessable entity", err.sqlMessage)).code(422);
            else
                return h.response(yield errorPayload(418, "server issue", "fatal error occurred")).code(418);
        }
    });
}
exports.errorCatcher = errorCatcher;
