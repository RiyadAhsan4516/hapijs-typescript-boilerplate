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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const userAccount_entity_1 = require("./userAccount.entity");
const data_source_1 = require("../../data-source");
const typedi_1 = require("typedi");
let UserRepository = exports.UserRepository = class UserRepository {
    constructor() {
        this.userRepo = data_source_1.AppDataSource.getRepository(userAccount_entity_1.User);
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepo.createQueryBuilder()
                .maxExecutionTime(1000)
                .getMany();
        });
    }
    getOneUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepo.createQueryBuilder()
                .where("id = :id", { id })
                .maxExecutionTime(1000)
                .getOne();
        });
    }
    getUserWithPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepo.createQueryBuilder("user")
                .select(["user.id", "user.email", "user.password"])
                .where("user.email = :email", { email: email })
                .getOne();
        });
    }
    createUser(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newUser = yield this.userRepo.createQueryBuilder()
                    .insert()
                    .into(userAccount_entity_1.User)
                    .values(inputs)
                    .returning(["id", 'email'])
                    .execute();
                return newUser.raw;
            }
            catch (err) {
                return err;
            }
        });
    }
    UpdateUser(inputs, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let newInputs = __rest(inputs
            // @ts-ignore
            , []);
            // @ts-ignore
            let user = yield this.userRepo.createQueryBuilder()
                .update(userAccount_entity_1.User)
                .set(newInputs)
                .where(id)
                .execute();
            return user.raw;
        });
    }
};
exports.UserRepository = UserRepository = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UserRepository);
