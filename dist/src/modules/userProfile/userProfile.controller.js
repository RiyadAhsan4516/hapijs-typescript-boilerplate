"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UserProfileController = void 0;
const userProfile_service_1 = require("./userProfile.service");
const typedi_1 = require("typedi");
const payloadFormatter_1 = require("../../helpers/payloadFormatter");
let UserProfileController = exports.UserProfileController = class UserProfileController {
    createProfile(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = typedi_1.Container.get(userProfile_service_1.UserProfileService);
            // @ts-ignore
            const attributes = Object.assign({}, req.payload);
            let result = yield this.service.createUserProfile(attributes);
            return h.response(yield (0, payloadFormatter_1.payloadFormatter)(result)).code(200);
        });
    }
    // async getProfile(req: Request, h:ResponseToolkit<ReqRefDefaults>): Promise<void>{
    //     let id = +req.params.id;
    //     let result = await this.service.getUserProfile(id);
    //     if(result.errno || result.error){
    //         return next(result)
    //     }
    //     res.status(200).json({
    //         data: result
    //     })
    // }
    getAllProfiles(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = typedi_1.Container.get(userProfile_service_1.UserProfileService);
            let result = yield service.getProfiles();
            return h.response(result).code(200);
        });
    }
};
exports.UserProfileController = UserProfileController = __decorate([
    (0, typedi_1.Service)()
], UserProfileController);
