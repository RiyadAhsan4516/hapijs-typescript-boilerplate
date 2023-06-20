"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const data_source_1 = require("../data-source");
const roleEntity_1 = require("../entities/roleEntity");
class RoleRepository {
    _roleRepo;
    constructor() {
        this._roleRepo = data_source_1.AppDataSource.getRepository(roleEntity_1.Roles);
    }
    async getAll() {
        return await this._roleRepo.find();
    }
}
exports.RoleRepository = RoleRepository;
