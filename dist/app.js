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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.init = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const Hapi = __importStar(require("@hapi/hapi"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./src/routes"));
const inert_1 = __importDefault(require("@hapi/inert"));
// ********************************************
// *                                          *
// *         CREATE SERVER INSTANCE           *
// *                                          *
// ********************************************
const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.LOCALHOST,
    routes: {
        files: {
            relativeTo: path_1.default.join(__dirname, 'public')
        }
    }
});
// ********************************************
// *                                          *
// *          SERVER INITIALIZER              *
// *                                          *
// ********************************************
const init = async () => {
    await server.register(inert_1.default);
    server.route({
        method: 'GET',
        path: '/{picture}',
        handler: function (req, h) {
            return h.file(`${req.params.picture}`);
        }
    });
    server.route(routes_1.default);
    return server;
};
exports.init = init;
// ********************************************
// *                                          *
// *         SERVER START FUNCTION            *
// *                                          *
// ********************************************
const start = async () => {
    await server.start();
    return server;
};
exports.start = start;
