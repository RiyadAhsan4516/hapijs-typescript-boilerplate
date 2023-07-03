"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const data_source_1 = require("../data-source");
const roleEntity_1 = require("../entities/roleEntity");
const typedi_1 = require("typedi");
let RoleRepository = exports.RoleRepository = class RoleRepository {
    _roleRepo;
    constructor() {
        this._roleRepo = data_source_1.AppDataSource.getRepository(roleEntity_1.Roles);
    }
    async getAll() {
        return await this._roleRepo.find();
    }
};
exports.RoleRepository = RoleRepository = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], RoleRepository);
