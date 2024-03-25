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
exports.paginate = void 0;
function paginate(query, limit, pageNo, order) {
    return __awaiter(this, void 0, void 0, function* () {
        let take = limit;
        let skip = (pageNo - 1) * limit;
        let total_count = yield query.getCount();
        const last_page = Math.ceil(total_count / limit);
        if (pageNo > last_page) {
            skip = (last_page) * (limit);
        }
        let data = yield query
            .take(take)
            .skip(skip)
            .maxExecutionTime(1000)
            .orderBy(order)
            .maxExecutionTime(1000)
            .getMany();
        return { total_count, data };
    });
}
exports.paginate = paginate;
