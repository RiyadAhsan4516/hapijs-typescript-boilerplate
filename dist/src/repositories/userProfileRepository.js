"use strict";
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
const userProfileEntity_1 = require("../entities/userProfileEntity");
const data_source_1 = require("../data-source");
class UserProfileRepository {
    constructor() {
        this.userProfileRepo = data_source_1.AppDataSource.getRepository(userProfileEntity_1.UserProfile);
    }
    createUserProfile(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newUserProfile = yield this.userProfileRepo.createQueryBuilder()
                    .insert()
                    .into(userProfileEntity_1.UserProfile)
                    .values(inputs)
                    .returning(["id", 'name', 'address', 'phone_number', 'profile_photo', 'user_id', 'role'])
                    .execute();
                return newUserProfile.raw[0];
            }
            catch (err) {
                return err;
            }
        });
    }
    getAUserProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userProfileRepo.find({
                    where: { id },
                    relations: {
                        role: true,
                        user_id: true
                    },
                });
            }
            catch (err) {
                return { error: "Something went wrong" };
            }
        });
    }
    getAllProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userProfileRepo.find({
                    relations: {
                        role: true,
                        user_id: true
                    }
                });
            }
            catch (err) {
                return { error: "something went wrong" };
            }
        });
    }
}
exports.UserProfileRepository = UserProfileRepository;
