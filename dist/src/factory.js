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
exports.RepoFactory = void 0;
const data_source_1 = require("./data-source");
const typedi_1 = require("typedi");
const paginator_1 = require("./helpers/paginator");
let RepoFactory = class RepoFactory {
    set repoSetter(entity) {
        this.entity = entity;
        this.repository = data_source_1.AppDataSource.getRepository(entity);
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.createQueryBuilder()
                .insert()
                .into(this.entity)
                .values(payload)
                .execute();
            return { message: "Data inserted successfully" };
        });
    }
    getAll(limit_1, pageNo_1) {
        return __awaiter(this, arguments, void 0, function* (limit, pageNo, params = null) {
            let query = this.repository.createQueryBuilder();
            query = yield this.addQuery(query, params);
            return yield (0, paginator_1.paginate)(query, limit, pageNo, { "modified_at": "DESC" });
        });
    }
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.createQueryBuilder()
                .where("id = :id", { id })
                .maxExecutionTime(1000)
                .getOne();
        });
    }
    update(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.createQueryBuilder()
                .update(this.entity)
                .set(payload)
                .where("id = :id", { id })
                .execute();
            return { message: "Information updated successfully" };
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.createQueryBuilder()
                .delete()
                .from(this.entity)
                .where("id = :id", { id })
                .execute();
            return { message: "Data has been deleted" };
        });
    }
    addQuery(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            // ADD QUERIES HERE
            if (params) { /*set params here*/ }
            return query;
        });
    }
};
exports.RepoFactory = RepoFactory;
exports.RepoFactory = RepoFactory = __decorate([
    (0, typedi_1.Service)()
], RepoFactory);
