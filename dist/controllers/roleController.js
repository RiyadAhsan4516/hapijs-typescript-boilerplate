"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const roleService_1 = require("../services/roleService");
const typedi_1 = require("typedi");
let RoleController = exports.RoleController = class RoleController {
    async getAllRoles(req, h) {
        const service = typedi_1.Container.get(roleService_1.RoleService);
        return await service.getAllRoles();
    }
};
exports.RoleController = RoleController = __decorate([
    (0, typedi_1.Service)()
], RoleController);
