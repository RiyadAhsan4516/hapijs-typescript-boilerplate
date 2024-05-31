"use strict";
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
exports.eventHandlerPlugin = void 0;
const eventHandlerPlugin = {
    name: 'server_events',
    version: "0.1.1",
    register: function (server, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options.Server.events.on('empty_temp', (payload) => __awaiter(this, void 0, void 0, function* () {
                let data = JSON.stringify(payload);
                console.log(`Response inside the event: ${data}`);
                console.log(server);
            }));
        });
    }
};
exports.eventHandlerPlugin = eventHandlerPlugin;
