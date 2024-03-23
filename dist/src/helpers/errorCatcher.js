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
            if (process.env.NODE_ENV == "development")
                console.log(err);
            if (err.isBoom)
                return h.response(err.output.payload).code(err.output.statusCode);
            else if (err.sqlState && err.errno == 1062)
                return h.response("Duplicate Entry found").code(400);
            else if (err.sqlState && err.errno == 1451)
                return h.response("cannot add/update/delete due to foreign key constraint").code(400);
            else if (err.sqlState && err.errno)
                return h.response({
                    statusCode: 422,
                    error: "unprocessable entity",
                    message: err.sqlMessage
                }).code(422);
            throw (0, boom_1.teapot)("sip on your tea while i fix my code :)");
        }
    });
}
exports.errorCatcher = errorCatcher;
