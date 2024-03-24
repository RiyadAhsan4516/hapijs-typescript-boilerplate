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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const notification_entity_1 = require("./notification.entity");
const data_source_1 = require("../../data-source");
const typedi_1 = require("typedi");
const Boom = __importStar(require("@hapi/boom"));
let NotificationRepository = exports.NotificationRepository = class NotificationRepository {
    constructor() {
        this.notifyRepo = data_source_1.AppDataSource.getRepository(notification_entity_1.Notification);
    }
    getNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.notifyRepo.createQueryBuilder("notification")
                    .where('notification.read_status = :value', { value: 0 })
                    .getMany();
            }
            catch (err) {
                console.log(err);
                throw Boom.badData("getNotification query failed");
            }
        });
    }
    createNotification(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let notification = yield this.notifyRepo.createQueryBuilder()
                    .insert()
                    .into(notification_entity_1.Notification)
                    .values(input)
                    .execute();
                return notification.raw;
            }
            catch (err) {
                throw Boom.badData("could not create a new notification");
            }
        });
    }
    updateReadStatus(read_status, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newInputs = { read_status };
                let notification = yield this.notifyRepo.createQueryBuilder()
                    .update(notification_entity_1.Notification)
                    .set(newInputs)
                    .where('id = :id', { id })
                    .execute();
                return true;
            }
            catch (err) {
                console.log(err);
                throw Boom.badData("updateReadStatus failed");
            }
        });
    }
};
exports.NotificationRepository = NotificationRepository = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], NotificationRepository);
