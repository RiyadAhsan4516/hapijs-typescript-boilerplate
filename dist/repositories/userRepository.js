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
exports.UserRepository = void 0;
const userEntity_1 = require("../entities/userEntity");
const data_source_1 = require("../data-source");
const typedi_1 = require("typedi");
let UserRepository = exports.UserRepository = class UserRepository {
    userRepo;
    constructor() {
        this.userRepo = data_source_1.AppDataSource.getRepository(userEntity_1.User);
    }
    async getAllUsers() {
        return await this.userRepo.find();
    }
    async getOneUser(id) {
        return await this.userRepo.findOneBy({ id });
    }
    async getUserWithPassword(email) {
        return await this.userRepo.createQueryBuilder("user")
            .select(["user.id", "user.email", "user.password"])
            .where("user.email = :email", { email: email })
            .getOne();
    }
    async createUser(inputs) {
        try {
            let newUser = await this.userRepo.createQueryBuilder()
                .insert()
                .into(userEntity_1.User)
                .values(inputs)
                .returning(["id", 'email'])
                .execute();
            return newUser.raw;
        }
        catch (err) {
            return err;
        }
    }
    async UpdateUser(inputs, id) {
        let { ...newInputs } = inputs;
        let user = await this.userRepo.createQueryBuilder()
            .update(userEntity_1.User)
            .set(newInputs)
            .where(id)
            .execute();
        return user.raw;
    }
    async DeleteUser(input) {
        await this.userRepo.createQueryBuilder()
            .delete()
            .from(userEntity_1.User)
            .where({ id: input })
            .execute();
    }
};
exports.UserRepository = UserRepository = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UserRepository);
