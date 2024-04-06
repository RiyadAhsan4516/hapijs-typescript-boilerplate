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
exports.client = exports.start = exports.init = void 0;
// Third party imports
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const hapi_1 = require("@hapi/hapi");
const path_1 = require("path");
const inert = __importStar(require("@hapi/inert"));
const HapiJwt = __importStar(require("hapi-auth-jwt2"));
const vision = __importStar(require("@hapi/vision"));
const pino = __importStar(require("hapi-pino"));
const static_auth = __importStar(require("hapi-auth-bearer-token"));
const redis_1 = require("redis");
const typedi_1 = require("typedi");
const hapi_rate_limitor = __importStar(require("hapi-rate-limitor"));
// @ts-ignore
const scooter = __importStar(require("@hapi/scooter"));
// Local module imports
const authentication_controller_1 = require("./src/modules/authentication/authentication.controller");
const customPlugins_1 = require("./src/helpers/customPlugins");
// Local routes imports
const routes_1 = __importDefault(require("./src/routes"));
const boom_1 = require("@hapi/boom");
const errorCatcher_1 = require("./src/helpers/errorCatcher");
const promises_1 = __importDefault(require("fs/promises"));
// ********************************************
// *                                          *
// *         CREATE REDIS CONNECTION          *
// *                                          *
// ********************************************
const client = (0, redis_1.createClient)({ url: `redis://default:${process.env.REDIS_PASSWORD}@127.0.0.1:6379/0` });
exports.client = client;
try {
    client.connect().then(() => console.log("redis connected"));
}
catch (err) {
    console.log(err);
}
// ********************************************
// *                                          *
// *         CREATE SERVER INSTANCE           *
// *                                          *
// ********************************************
const server = new hapi_1.Server({
    port: process.env.PORT,
    host: process.env.LOCALHOST,
    debug: false,
    routes: {
        files: {
            relativeTo: (0, path_1.join)(__dirname, 'public')
        },
        cors: {
            origin: ["*"],
            headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
            credentials: true,
            preflightStatusCode: 204
        }
    },
});
// ********************************************
// *                                          *
// *          SET UP PINO LOGGER              *
// *                                          *
// ********************************************
// MULTIPLE TARGETS CAN ALSO BE SET AT ONCE. IN THAT CASE THE TARGETS MUST BE AN ARRAY
let transport = {
    target: "pino/file",
    options: { destination: `${__dirname}/app.log` }
};
// ********************************************
// *                                          *
// *          SERVER INITIALIZER              *
// *                                          *
// ********************************************
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    // CREATE CUSTOM EVENTS
    server.event("empty_temp");
    // REGISTER PLUGINS
    // @ts-ignore
    yield server.register([
        {
            plugin: inert // inert is a plugin used for serving static files
        },
        {
            plugin: HapiJwt // jwt plugin required for creating auth strategy. Look up authentication in hapi.js documentation
        },
        {
            plugin: static_auth // static token authentication
        },
        {
            plugin: vision // a plugin used for rendering templates
        },
        {
            plugin: require("susie")
        },
        {
            plugin: pino,
            options: {
                transport,
                level: 'info',
                async: true,
            }
        },
        {
            plugin: hapi_rate_limitor,
            options: {
                redis: `redis://default:${process.env.REDIS_PASSWORD}@127.0.0.1:6379/0`,
                extensionPoint: 'onPostAuth',
                namespace: 'hapi-rate-limitor',
                max: 100,
                duration: 1000 * 60,
                enabled: true,
                userAttribute: 'id',
                userLimitAttribute: 'rateLimit'
            }
        },
        {
            plugin: customPlugins_1.eventHandlerPlugin,
            options: {
                Server: server
            }
        },
        {
            plugin: scooter
        }
    ]);
    // EXTRACT THE KEY FOR IS LOGGED IN JWT VERIFICATION
    // IF PRIVATE KEY IS NOT CREATED, THEN CREATE IT : openssl genrsa -out private_key.pem 2048
    // IF PUBLIC KEY IS NOT CREATED, THEN CREATE IT AS WELL : openssl rsa -pubout -in private_key.pem -out public_key.pem
    const publicKey = yield promises_1.default.readFile("./public_key.pem", 'utf8');
    server.auth.strategy('jwt', 'jwt', {
        key: publicKey,
        validate: typedi_1.Container.get(authentication_controller_1.AuthController).isLoggedIn,
        verifyOptions: {
            algorithms: ["RS256"]
        }
    });
    server.auth.strategy('static', 'bearer-access-token', {
        validate: typedi_1.Container.get(authentication_controller_1.AuthController).staticTokenValidator
    });
    server.route({
        method: "GET",
        path: `/api/v1/file`,
        handler: (0, errorCatcher_1.errorCatcher)(function (req, h) {
            return __awaiter(this, void 0, void 0, function* () {
                // @ts-ignore
                let path = req.query["path"];
                if (!path)
                    throw (0, boom_1.badRequest)("file path not found in query");
                let root_path = (0, path_1.join)(__dirname);
                const distRegEx = /dist/;
                let filepath;
                if (distRegEx.test(root_path))
                    filepath = (0, path_1.join)(__dirname, '/..', '/..', 'public', path);
                else
                    filepath = (0, path_1.join)(__dirname, '/..', 'public', path);
                return h.file(filepath, { confine: false }).header('Cache-Control', "public, max-age=3600");
            });
        })
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
const start = (server) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.start();
    return server;
});
exports.start = start;
