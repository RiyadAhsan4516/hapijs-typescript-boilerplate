import { DataSource } from "typeorm"
import * as dotenv from 'dotenv';
dotenv.config();

import {PasswordEncryptionSubscriber} from "./helpers/passwordEncryptionSubscriber";
import {User} from "./entities/userEntity";
import {UserProfile} from "./entities/userProfileEntity";
import {Roles} from "./entities/roleEntity";
import {Notification} from "./entities/notificationEntity";
import {PolicyReadStatus} from "./entities/policyEntity";

let entity_list : any  = [User, UserProfile, Roles, Notification, PolicyReadStatus]

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
    subscribers: [PasswordEncryptionSubscriber],
    migrationsRun: true
})
