import { DataSource } from "typeorm"
// import * as dotenv from 'dotenv';
// dotenv.config();

import {User} from "./modules/userAccount/userAccount.entity";
import {UserProfile} from "./modules/userProfile/userProfile.entity";
import {Roles} from "./modules/roles/roles.entity";
import {Notification} from "./modules/notification/notification.entity";
import {PasswordEncryptionSubscriber} from "./helpers/passwordEncryptionSubscriber";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";

let entity_list : any  = [User, UserProfile, Roles, Notification]

export const AppDataSource : DataSource = new DataSource({
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
    namingStrategy: new SnakeNamingStrategy(),
    cache: {
        duration: 1000
    },
    subscribers: [PasswordEncryptionSubscriber],
    migrationsRun: true
})
