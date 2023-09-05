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
exports.NotificationController = void 0;
const typedi_1 = require("typedi");
const Stream = __importStar(require("stream"));
const boom_1 = require("@hapi/boom");
const notificationService_1 = require("../services/notificationService");
let NotificationController = exports.NotificationController = class NotificationController {
    // POST A NOTIFICATION. INITIALLY WITH THE STATUS 0
    createNotification(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            let notification = req.payload["notification"];
            let result = yield typedi_1.Container.get(notificationService_1.NotificationService).createNotification(notification);
            if (result.length < 1)
                throw new boom_1.Boom("no notification was created", { statusCode: 400 });
            return result;
        });
    }
    // SERVE NOTIFICATION USING SSE CONNECTION. SET STATUS TO 1 AFTER BEING SENT
    getNotification(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            // noinspection JSUnusedGlobalSymbols
            class ResponseStream extends Stream.PassThrough {
                setCompressor(compressor) {
                    // @ts-ignore
                    this._compressor = compressor;
                }
            }
            const stream = new ResponseStream();
            let service = typedi_1.Container.get(notificationService_1.NotificationService);
            let intervalId = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                let data = yield service.serveNotification();
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        stream.write(`id: ${data[i].id}\n`);
                        stream.write('data:' + data[i].notification + ';\n\n');
                        // CHANGE READ STATUS
                        yield service.changeStatus(data[i].id, 1);
                    }
                }
                //@ts-ignore
                stream._compressor.flush();
            }), 100);
            req.raw.req.on('close', () => {
                clearInterval(intervalId);
                stream.end();
            });
            return h.response(stream).type('text/event-stream');
        });
    }
    // CHANGE NOTIFICATION STATUS TO 2 WHEN IT IS READ
    changeReadStatus(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = +req.params["id"];
            console.log(id);
            return yield typedi_1.Container.get(notificationService_1.NotificationService).changeStatus(+id, 2);
        });
    }
};
exports.NotificationController = NotificationController = __decorate([
    (0, typedi_1.Service)()
], NotificationController);
