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
exports.RoleController = void 0;
const typedi_1 = require("typedi");
// LOCAL IMPORTS
const errorChecker_1 = require("../helpers/errorChecker");
const roleService_1 = require("../services/roleService");
const payloadCompressor_1 = require("../helpers/payloadCompressor");
let RoleController = exports.RoleController = class RoleController {
    getAllRoles(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            // CHECK REQUEST METHOD
            (0, errorChecker_1.methodTypeCheck)(req.method, 'get');
            const service = typedi_1.Container.get(roleService_1.RoleService);
            //FETCH DATA FROM REPOSITORY
            let data = yield service.getAllRoles();
            //COMPRESS THE FETCHED DATA USING ZLIB GZIP FUNCTION
            let compressedData = yield (0, payloadCompressor_1.payloadCompressor)(data);
            // RETURN THE COMPRESSED DATA ALONG WITH CUSTOMIZED HEADER
            return h.response(compressedData).header('Content-Encoding', 'gzip').type("application/json");
        });
    }
    // FINISH SETTING UP REDIS OBJECT UPON CREATION
    createRoles(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = req.payload;
            let result = typedi_1.Container.get(roleService_1.RoleService).createRoles(payload);
            console.log(result);
        });
    }
};
exports.RoleController = RoleController = __decorate([
    (0, typedi_1.Service)()
], RoleController);
