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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.init = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const Hapi = __importStar(require("@hapi/hapi"));
const path = __importStar(require("path"));
const routes_1 = __importDefault(require("./src/routes"));
const inert = __importStar(require("@hapi/inert"));
const HapiJwt = __importStar(require("hapi-auth-jwt2"));
const authController_1 = require("./src/controllers/authController");
const typedi_1 = require("typedi");
const HapiSwagger = __importStar(require("hapi-swagger"));
const vision = __importStar(require("@hapi/vision"));
const SwaggerFile = require("./assets/swagger.json");
const swaggerOptions = {
    customSwaggerFile: SwaggerFile
};
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
            relativeTo: path.join(__dirname, 'public')
        }
    }
});
// ********************************************
// *                                          *
// *          SERVER INITIALIZER              *
// *                                          *
// ********************************************
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    yield server.register([
        {
            plugin: inert
        },
        {
            plugin: HapiJwt
        },
        {
            plugin: vision
        },
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    server.auth.strategy('jsonWebToken', 'jwt', {
        key: `${process.env.SECRET}`,
        validate: typedi_1.Container.get(authController_1.AuthController).isLoggedIn
    });
    server.route({
        method: 'GET',
        path: '/{picture}',
        handler: function (req, h) {
            return h.file(`${req.params.picture}`);
        }
    });
    server.route(routes_1.default);
    return server;
});
exports.init = init;
// ********************************************
// *                                          *
// *         SERVER START FUNCTION            *
// *                                          *
// ********************************************
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield server.start();
    return server;
});
exports.start = start;
