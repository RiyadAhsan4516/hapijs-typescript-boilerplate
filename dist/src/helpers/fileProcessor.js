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
exports.fileProcessor = void 0;
const fs_1 = require("fs");
const boom_1 = require("@hapi/boom");
function fileProcessor(uploaded_file) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileType = uploaded_file.headers['content-type'].split("/")[1];
        const dest = `public${uploaded_file.path.split("tmp")[1]}.${fileType}`;
        (0, fs_1.rename)(uploaded_file.path, dest, (err) => {
            if (err)
                throw (0, boom_1.badData)("Bad file was provided. Upload failed");
        });
        return dest.split("public")[1];
    });
}
exports.fileProcessor = fileProcessor;
