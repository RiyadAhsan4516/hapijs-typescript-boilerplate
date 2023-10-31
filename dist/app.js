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
const HapiSwagger = __importStar(require("hapi-swagger"));
const vision = __importStar(require("@hapi/vision"));
const pino = __importStar(require("hapi-pino"));
const static_auth = __importStar(require("hapi-auth-bearer-token"));
const redis_1 = require("redis");
const typedi_1 = require("typedi");
// @ts-ignore
const hapi_rate_limiter = __importStar(require("hapi-rate-limit"));
// Local module imports
const authController_1 = require("./src/controllers/authController");
const customPlugins_1 = require("./src/helpers/customPlugins");
// Local routes imports
const routes_1 = __importDefault(require("./src/routes"));
// ********************************************
// *                                          *
// *       OPTIONAL: SET UP SWAGGER           *
// *                                          *
// ********************************************
const SwaggerFile = require("./assets/swagger.json");
const swaggerOptions = {
    customSwaggerFile: SwaggerFile
};
// ********************************************
// *                                          *
// *         CREATE REDIS CONNECTION          *
// *                                          *
// ********************************************
const client = (0, redis_1.createClient)({ url: `redis://default:${process.env.REDIS_PASSWORD}@127.0.0.1:6379/3` });
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
            headers: ["Accept", "Content-Type"],
            credentials: true,
        }
    },
});
// ********************************************
// *                                          *
// *          SET UP PINO LOGGER              *
// *                                          *
// ********************************************
// MULTIPLE TARGETS CAN ALSO BE SET AT ONCE. IN THAT CASE THE TARGETS MUST BE AN ARRAY
let transport;
if (process.env.NODE_ENV === 'production') {
    transport = {
        target: "pino/file",
        options: { destination: `${__dirname}/app.log` }
    };
}
else {
    transport = {
        target: '@logtail/pino',
        options: { sourceToken: process.env.LOGTAIL_TOKEN }
    };
}
// ********************************************
// *                                          *
// *          SERVER INITIALIZER              *
// *                                          *
// ********************************************
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    // CREATE CUSTOM EVENTS
    server.event("empty_temp");
    // REGISTER PLUGINS
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
            plugin: HapiSwagger,
            options: swaggerOptions
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
            plugin: hapi_rate_limiter,
            options: {
                enabled: true,
                userLimit: 100,
            }
        },
        {
            plugin: customPlugins_1.eventHandlerPlugin,
            options: {
                Server: server
            }
        }
    ]);
    server.auth.strategy('jwt', 'jwt', {
        key: `${process.env.SECRET}`,
        validate: typedi_1.Container.get(authController_1.AuthController).isLoggedIn // the token will be decoded by the plugin automatically
    });
    server.auth.strategy('static', 'bearer-access-token', {
        validate: typedi_1.Container.get(authController_1.AuthController).staticTokenValidator
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
const start = (server) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.start();
    return server;
});
exports.start = start;
