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
exports.UserProfileService = void 0;
const userProfile_repository_1 = require("./userProfile.repository");
const fileProcessor_1 = require("../../helpers/fileProcessor");
const typedi_1 = require("typedi");
const joi_1 = require("joi");
let UserProfileService = exports.UserProfileService = class UserProfileService {
    constructor() {
        this.repository = typedi_1.Container.get(userProfile_repository_1.UserProfileRepository);
    }
    createUserProfile(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (inputs.profile_photo)
                inputs.profile_photo = yield (0, fileProcessor_1.fileProcessor)(inputs.profile_photo, ["jpeg", "png"], 3000000);
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
        const schema = (0, joi_1.object)({
            id: (0, joi_1.number)().required().messages({
                'number.base': "id should be of number type",
                'any.required': "id is a required field"
            })
        });
        return schema.validate({ id: input }, { abortEarly: false });
    }
    validateCreateInput(input) {
        const redisSchemas = (0, joi_1.object)({
            email: (0, joi_1.string)().email().messages({ 'string.base': "email should be of type string" }),
            password: (0, joi_1.string)().min(8),
            userProfile_id: (0, joi_1.number)().optional()
        });
        return redisSchemas.validate(input);
    }
};
exports.UserProfileService = UserProfileService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UserProfileService);
