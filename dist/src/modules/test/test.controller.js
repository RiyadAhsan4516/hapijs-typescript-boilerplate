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
exports.TestController = void 0;
const typedi_1 = require("typedi");
let TestController = class TestController {
    getAll(req, h) {
        return __awaiter(this, void 0, void 0, function* () {
            let limit = +req.params.limit;
            let pageNo = +req.params.pageNo;
            let params = Object.assign({}, req.query);
            // @ts-ignore
            let request = Object.assign({}, req);
            console.log(request.plugins["scooter"].source);
            return h.response("check terminal").code(200);
            // let service : UserService = Container.get(UserService);
            // let result : {total_count: number, data: any[]} = await service.getAll(limit, pageNo, params)
            // if(!result || result.total_count<1) return h.response("No data found").code(204)
            // return h.response(await payloadFormatter(result)).code(200)
        });
    }
};
exports.TestController = TestController;
exports.TestController = TestController = __decorate([
    (0, typedi_1.Service)()
], TestController);
