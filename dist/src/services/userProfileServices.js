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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileService = void 0;
const userProfileRepository_1 = require("../repositories/userProfileRepository");
const typedi_1 = require("typedi");
const fs = __importStar(require("fs"));
const joi_1 = __importDefault(require("joi"));
const boom_1 = require("@hapi/boom");
let UserProfileService = exports.UserProfileService = class UserProfileService {
    constructor() {
        this.repository = new userProfileRepository_1.UserProfileRepository();
    }
    createUserProfile(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (inputs.profile_photo) {
                let file = inputs.profile_photo;
                const fileType = file.headers['content-type'].split("/")[1];
                const dest = `public${file.path.split("tmp")[1]}.${fileType}`;
                fs.rename(file.path, dest, (err) => {
                    if (err)
                        throw new boom_1.Boom("the file did not upload", { statusCode: 400 });
                });
                inputs.profile_photo = dest.split("public")[1];
            }
            return yield this.repository.createUserProfile(inputs);
        });
    }
    getUserProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = this.validateIdInput(id);
            if (validation.error) {
                return { errno: 400, error: validation.error.details[0].message };
            }
            const result = yield this.repository.getAUserProfile(id);
            if (result.length > 0)
                return result;
            else
                return { errno: 404, error: "no result found" };
        });
    }
    getProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getAllProfiles();
        });
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
};
exports.UserProfileService = UserProfileService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UserProfileService);
