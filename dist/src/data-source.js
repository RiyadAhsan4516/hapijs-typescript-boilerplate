"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
// import * as dotenv from 'dotenv';
// dotenv.config();
const userAccount_entity_1 = require("./modules/userAccount/userAccount.entity");
const userProfile_entity_1 = require("./modules/userProfile/userProfile.entity");
const roles_entity_1 = require("./modules/roles/roles.entity");
const notification_entity_1 = require("./modules/notification/notification.entity");
const passwordEncryptionSubscriber_1 = require("./helpers/passwordEncryptionSubscriber");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
let entity_list = [userAccount_entity_1.User, userProfile_entity_1.UserProfile, roles_entity_1.Roles, notification_entity_1.Notification];
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
