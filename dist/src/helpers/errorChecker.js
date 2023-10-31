"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodTypeCheck = void 0;
const boom_1 = require("@hapi/boom");
function methodTypeCheck(req_type, expected_type) {
    if (req_type !== expected_type)
        throw (0, boom_1.methodNotAllowed)(`${req_type} method not allowed on this route`);
}
exports.methodTypeCheck = methodTypeCheck;
