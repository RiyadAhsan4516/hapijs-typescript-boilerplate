"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRepo = void 0;
const redis_om_1 = require("redis-om");
const app_1 = require("../../app");
// IMPORT ALL THE AVAILABLE SCHEMAS
const roleSchema_1 = require("../redisSchemas/roleSchema");
const roleRepo = new redis_om_1.Repository(roleSchema_1.roleSchema, app_1.client);
exports.roleRepo = roleRepo;
