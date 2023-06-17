import { DataSource } from "typeorm"
import * as dotenv from 'dotenv';
dotenv.config();

import {User} from "./entities/userEntity";
import {UserProfile} from "./entities/userProfileEntity";
import {Roles} from "./entities/roleEntity";
import {PasswordEncryptionSubscriber} from "./helpers/passwordEncryptionSubscriber";

export const AppDataSource : DataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_LOCAL,
    synchronize: true,
    logging: false,
    poolSize: 1,
    entities: [User, Roles, UserProfile],
    subscribers: [PasswordEncryptionSubscriber],
    migrationsRun: true
})
