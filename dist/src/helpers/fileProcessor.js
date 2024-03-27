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
function fileProcessor(uploaded_file, allowed_types, file_size = 2000000, folder = null) {
    return __awaiter(this, void 0, void 0, function* () {
        // CHECK FILE HEADERS
        if (!uploaded_file.headers)
            throw (0, boom_1.badData)("if image is uploaded, then it must be a file");
        // CHECK FILE SIZE
        if (uploaded_file.bytes > file_size)
            throw (0, boom_1.badData)("the uploaded file is too large!");
        // CHECK THE FILE TYPE
        const file_type = uploaded_file.headers['content-type'].split("/")[1];
        const fileType = uploaded_file.filename.split(".")[1];
        if (!allowed_types.includes(file_type))
            throw (0, boom_1.unsupportedMediaType)("file type invalid");
        let filepath = uploaded_file.path.split("/tmp")[0];
        // SAVE THE FILE IN ITS CORRESPONDING FOLDER
        let dest;
        if (folder)
            dest = `${filepath}/${folder}/${uploaded_file.path.split("tmp")[1]}.${fileType}`;
        else
            dest = `${filepath}${uploaded_file.path.split("tmp")[1]}.${fileType}`;
        yield (0, fs_1.rename)(uploaded_file.path, dest, (err) => {
            if (err) {
                throw (0, boom_1.badData)("Bad file was provided. Upload failed");
            }
        });
        return dest.split("public")[1];
    });
}
exports.fileProcessor = fileProcessor;
