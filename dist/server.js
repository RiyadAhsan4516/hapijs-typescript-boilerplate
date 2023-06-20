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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const data_source_1 = require("./src/data-source");
require("reflect-metadata");
const app_1 = require("./app");
// ********************************************
// *                                          *
// *        INITIALIZE THE DATABASE           *
// *                                          *
// ********************************************
if (process.env.NODE_ENV === 'development') {
    console.log("Environment switched to development");
    data_source_1.AppDataSource.initialize()
        .then(() => {
        console.log("Data Source has been initialized!");
    })
        .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
}
else {
    data_source_1.AppDataSource.initialize().catch((err) => {
        console.error("Database failed to load");
    });
}
// ********************************************
// *                                          *
// *      HANDLE UNHANDLED REJECTIONS         *
// *                                          *
// ********************************************
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
// ********************************************
// *                                          *
// *    INITIALIZE AND START THE SERVER       *
// *                                          *
// ********************************************
async function launch() {
    if (process.env.NODE_ENV === 'development') {
        console.log("LAUNCHING THE SERVER =====>");
        await (0, app_1.init)();
        await (0, app_1.start)();
    }
    else {
        await (0, app_1.init)();
        await (0, app_1.start)();
    }
}
launch().then(() => {
    if (process.env.NODE_ENV === 'development')
        console.log("<========== SERVER LAUNCHED");
}).catch(err => {
    console.log("THERE WAS AN ERROR LAUNCHING THE SERVER");
});
