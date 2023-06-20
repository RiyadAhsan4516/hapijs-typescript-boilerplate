"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const userRepository_1 = require("../repositories/userRepository");
class UserService {
    repository;
    constructor() {
        this.repository = new userRepository_1.UserRepository();
    }
    async getAll() {
        return await this.repository.getAllUsers();
    }
    async getOne(id) {
        // const validation : Joi.ValidationResult<any> = this.validateIdInput(id)
        // if(validation.error){
        //     return {error: validation.error};
        // }
        return await this.repository.getOneUser(id);
    }
    async createUser(inputs) {
        return await this.repository.createUser(inputs);
    }
    async updateUser(inputs, id) {
        return await this.repository.UpdateUser(inputs, id);
    }
}
exports.UserService = UserService;
