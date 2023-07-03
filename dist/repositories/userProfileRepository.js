"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileRepository = void 0;
const userProfileEntity_1 = require("../entities/userProfileEntity");
const data_source_1 = require("../data-source");
class UserProfileRepository {
    userProfileRepo;
    constructor() {
        this.userProfileRepo = data_source_1.AppDataSource.getRepository(userProfileEntity_1.UserProfile);
    }
    async createUserProfile(inputs) {
        try {
            let newUserProfile = await this.userProfileRepo.createQueryBuilder()
                .insert()
                .into(userProfileEntity_1.UserProfile)
                .values(inputs)
                .returning(["id", 'name', 'address', 'phone_number', 'profile_photo', 'user_id', 'role'])
                .execute();
            return newUserProfile.raw[0];
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }
    async getAUserProfile(id) {
        try {
            return await this.userProfileRepo.find({
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
    }
    async getAllProfiles() {
        try {
            return await this.userProfileRepo.find({
                relations: {
                    role: true,
                    user_id: true
                }
            });
        }
        catch (err) {
            return { error: "something went wrong" };
        }
    }
}
exports.UserProfileRepository = UserProfileRepository;
