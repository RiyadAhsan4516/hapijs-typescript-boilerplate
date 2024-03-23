import { DataSource } from "typeorm"
import * as dotenv from 'dotenv';
dotenv.config();

import {User} from "./userAccount/userAccount.entity";
import {UserProfile} from "./userProfile/userProfile.entity";
import {Roles} from "./roles/roles.entity";
import {Notification} from "./notification/notification.entity";

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
    subscribers: ["./helpers/passwordEncryptionSubscriber"],
    migrationsRun: true
})
