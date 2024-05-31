"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = exports.casbin_adapter = void 0;
const typeorm_1 = require("typeorm");
const userAccount_entity_1 = require("./modules/userAccount/userAccount.entity");
const userProfile_entity_1 = require("./modules/userProfile/userProfile.entity");
const roles_entity_1 = require("./modules/roles/roles.entity");
const notification_entity_1 = require("./modules/notification/notification.entity");
const passwordEncryptionSubscriber_1 = require("./helpers/passwordEncryptionSubscriber");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const typeorm_adapter_1 = __importDefault(require("typeorm-adapter"));
const casbin_entity_1 = require("./modules/authorization/casbin.entity");
let entity_list = [userAccount_entity_1.User, userProfile_entity_1.UserProfile, roles_entity_1.Roles, notification_entity_1.Notification, casbin_entity_1.CustomCasbinRule];
typeorm_adapter_1.default.newAdapter({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_LOCAL,
}, {
    customCasbinRuleEntity: casbin_entity_1.CustomCasbinRule,
}).then((a) => exports.casbin_adapter = a);
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_LOCAL,
    synchronize: true,
    logging: ["error"],
    poolSize: 1,
    entities: entity_list,
    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
    cache: {
        duration: 1000
    },
    subscribers: [passwordEncryptionSubscriber_1.PasswordEncryptionSubscriber],
    migrationsRun: true
});
