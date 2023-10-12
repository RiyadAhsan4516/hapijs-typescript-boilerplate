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
const roleService_1 = require("../services/roleService");
const typedi_1 = require("typedi");
const errorChecker_1 = require("../helpers/errorChecker");
const zlib = __importStar(require("zlib"));
let RoleController = exports.RoleController = class RoleController {
    getAllRoles(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            // CHECK REQUEST METHOD
            (0, errorChecker_1.methodTypeCheck)(req.method, 'get');
            const service = typedi_1.Container.get(roleService_1.RoleService);
            const compressedData = zlib.gzipSync(JSON.stringify(yield service.getAllRoles())); // Compress data using zlib
            return h.response(compressedData).header('Content-Encoding', 'gzip').type("application/json");
        });
    }
    // FINISH SETTING UP REDIS OBJECT UPON CREATE
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
