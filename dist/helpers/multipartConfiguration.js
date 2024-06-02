"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipartConfig = void 0;
function multipartConfig(size, timeout) {
    return {
        allow: "multipart/form-data",
        parse: true,
        multipart: {
            output: "file"
        },
        maxBytes: 1000 * 1000 * size, // In MB
        timeout,
        uploads: 'public/tmp',
    };
}
exports.multipartConfig = multipartConfig;
