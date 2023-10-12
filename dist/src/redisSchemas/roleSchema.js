"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleSchema = void 0;
const redis_om_1 = require("redis-om");
const roleSchema = new redis_om_1.Schema('roles', {
    name: { type: "string" }
}, {
    dataStructure: "JSON"
});
exports.roleSchema = roleSchema;
