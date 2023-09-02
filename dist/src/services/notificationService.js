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
exports.NotificationService = void 0;
const typedi_1 = require("typedi");
const boom_1 = require("@hapi/boom");
const notificationRepository_1 = require("../repositories/notificationRepository");
let NotificationService = exports.NotificationService = class NotificationService {
    constructor() {
        this._notificationRepo = typedi_1.Container.get(notificationRepository_1.NotificationRepository);
    }
    serveNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._notificationRepo.getNotifications();
        });
    }
    changeStatus(id, read_status) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this._notificationRepo.updateReadStatus(read_status, id);
            if (!status)
                throw new boom_1.Boom("Nothing changed", { statusCode: 400 });
            return status;
        });
    }
    createNotification(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = { notification };
            let newNotification = yield this._notificationRepo.createNotification(payload);
            if (!newNotification || newNotification.length < 1)
                throw new boom_1.Boom("nothing changed in database", { statusCode: 400 });
            return newNotification;
        });
    }
};
exports.NotificationService = NotificationService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], NotificationService);
