"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const userEntity_1 = require("../entities/userEntity");
const data_source_1 = require("../data-source");
class UserRepository {
    userRepo;
    constructor() {
        this.userRepo = data_source_1.AppDataSource.getRepository(userEntity_1.User);
    }
    async getAllUsers() {
        return await this.userRepo.find();
    }
    async getOneUser(id) {
        console.log(id);
        return await this.userRepo.findOneBy({ id });
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
}
exports.UserRepository = UserRepository;
