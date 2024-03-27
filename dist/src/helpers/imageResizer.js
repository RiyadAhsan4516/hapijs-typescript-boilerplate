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
exports.imageResizer = void 0;
const boom_1 = require("@hapi/boom");
const path_1 = require("path");
let gm = require("gm").subClass({ imageMagick: '7+' });
function imageResizer(dimensions, path_to_file) {
    return __awaiter(this, void 0, void 0, function* () {
        let original_path = (0, path_1.join)(__dirname, '/..', '/..', 'public', path_to_file);
        let file_type = original_path.split(".")[1];
        let relative_path = original_path.split(".")[0];
        yield gm(original_path)
            .resize(dimensions.width, dimensions.height, '!')
            .write(`${relative_path}_thumb.${file_type}`, function (err) {
            if (err) {
                throw (0, boom_1.badImplementation)("Image resize failed");
            }
        });
        return `${relative_path}_thumb.${file_type}`.split("public")[1];
    });
}
exports.imageResizer = imageResizer;
