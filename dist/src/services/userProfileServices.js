"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileService = void 0;
const userProfileRepository_1 = require("../repositories/userProfileRepository");
const fs = __importStar(require("fs"));
const joi_1 = __importDefault(require("joi"));
const http_errors_1 = __importDefault(require("http-errors"));
class UserProfileService {
    repository;
    constructor() {
        this.repository = new userProfileRepository_1.UserProfileRepository();
    }
    async createUserProfile(inputs, file) {
        if (file) {
            const dest = 'public/' + file.filename;
            fs.rename(file.path, dest, (err) => {
                if (err)
                    return { error: (0, http_errors_1.default)(500, "the file did not upload") };
            });
            inputs.profile_photo = '/' + file.filename;
        }
        return await this.repository.createUserProfile(inputs);
    }
    async getUserProfile(id) {
        const validation = this.validateIdInput(id);
        if (validation.error) {
            console.log(validation.error);
            return { errno: 400, error: validation.error.details[0].message };
        }
        const result = await this.repository.getAUserProfile(id);
        if (result.length > 0)
            return result;
        else
            return { errno: 404, error: "no result found" };
    }
    async getProfiles() {
        return await this.repository.getAllProfiles();
    }
    validateIdInput(input) {
        const schema = joi_1.default.object({
            id: joi_1.default.number().required().messages({
                'number.base': "id should be of number type",
                'any.required': "id is a required field"
            })
        });
        return schema.validate({ id: input }, { abortEarly: false });
    }
    validateCreateInput(input) {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().messages({ 'string.base': "email should be of type string" }),
            password: joi_1.default.string().min(8),
            userProfile_id: joi_1.default.number().optional()
        });
        return schema.validate(input);
    }
}
exports.UserProfileService = UserProfileService;
