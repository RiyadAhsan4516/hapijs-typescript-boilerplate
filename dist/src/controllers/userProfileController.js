"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileController = void 0;
const userProfileServices_1 = require("../services/userProfileServices");
let service;
class UserProfileController {
    constructor() {
        service = new userProfileServices_1.UserProfileService();
    }
    async createProfile(req, h) {
        // @ts-ignore
        const attributes = { ...req.payload };
        console.log(attributes);
        return "hello";
    }
}
exports.UserProfileController = UserProfileController;
