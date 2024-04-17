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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileRepository = void 0;
const userProfile_entity_1 = require("./userProfile.entity");
const data_source_1 = require("../../data-source");
const typedi_1 = require("typedi");
let UserProfileRepository = class UserProfileRepository {
    constructor() {
        this.userProfileRepo = data_source_1.AppDataSource.getRepository(userProfile_entity_1.UserProfile);
    }
    createUserProfile(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            let newUserProfile = yield this.userProfileRepo.createQueryBuilder()
                .insert()
                .into(userProfile_entity_1.UserProfile)
                .values(inputs)
                .returning(["id", 'name', 'address', 'phone_number', 'profile_photo', 'user_id', 'role'])
                .execute();
            return newUserProfile.raw[0];
        });
    }
    getAUserProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userProfileRepo.createQueryBuilder()
                    .where("id = :id", { id })
                    .maxExecutionTime(1000)
                    .getOne();
            }
            catch (err) {
                return { error: "Something went wrong" };
            }
        });
    }
    getAllProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userProfileRepo.createQueryBuilder()
                    .maxExecutionTime(1000)
                    .getMany();
            }
            catch (err) {
                return { error: "something went wrong" };
            }
        });
    }
};
exports.UserProfileRepository = UserProfileRepository;
exports.UserProfileRepository = UserProfileRepository = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UserProfileRepository);
