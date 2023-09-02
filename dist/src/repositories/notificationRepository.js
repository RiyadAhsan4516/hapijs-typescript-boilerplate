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
exports.NotificationRepository = void 0;
const notificationEntity_1 = require("../entities/notificationEntity");
const data_source_1 = require("../data-source");
const typedi_1 = require("typedi");
const boom_1 = require("@hapi/boom");
let NotificationRepository = exports.NotificationRepository = class NotificationRepository {
    constructor() {
        this.notifyRepo = data_source_1.AppDataSource.getRepository(notificationEntity_1.Notification);
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
                throw new boom_1.Boom("getNotification query failed", { statusCode: 500 });
            }
        });
    }
    createNotification(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let notification = yield this.notifyRepo.createQueryBuilder()
                    .insert()
                    .into(notificationEntity_1.Notification)
                    .values(input)
                    .execute();
                return notification.raw;
            }
            catch (err) {
                throw new boom_1.Boom("could not create a new notification", { statusCode: 500 });
            }
        });
    }
    updateReadStatus(read_status, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newInputs = { read_status };
                let notification = yield this.notifyRepo.createQueryBuilder()
                    .update(notificationEntity_1.Notification)
                    .set(newInputs)
                    .where('id = :id', { id })
                    .execute();
                return true;
            }
            catch (err) {
                console.log(err);
                throw new boom_1.Boom("updateReadStatus failed", { statusCode: 500 });
            }
        });
    }
};
exports.NotificationRepository = NotificationRepository = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], NotificationRepository);
