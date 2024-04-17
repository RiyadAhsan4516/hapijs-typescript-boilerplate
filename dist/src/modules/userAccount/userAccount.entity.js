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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const userProfile_entity_1 = require("../userProfile/userProfile.entity");
const roles_entity_1 = require("../roles/roles.entity");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => userProfile_entity_1.UserProfile, (user_profile_id) => user_profile_id.user_id),
    __metadata("design:type", userProfile_entity_1.UserProfile)
], User.prototype, "user_profile_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => roles_entity_1.Roles, (role_id) => role_id.user_id),
    (0, typeorm_1.JoinColumn)({ name: "role_id" }),
    __metadata("design:type", roles_entity_1.Roles)
], User.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime" }),
    __metadata("design:type", Date)
], User.prototype, "account_creation_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], User.prototype, "modified_at", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)({ name: "user" })
], User);
