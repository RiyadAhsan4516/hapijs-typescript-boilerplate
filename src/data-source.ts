import {DataSource, EntitySchema} from "typeorm"
import {User} from "./modules/userAccount/userAccount.entity";
import {UserProfile} from "./modules/userProfile/userProfile.entity";
import {Roles} from "./modules/roles/roles.entity";
import {Notification} from "./modules/notification/notification.entity";
import {PasswordEncryptionSubscriber} from "./helpers/passwordEncryptionSubscriber";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import TypeORMAdapter from "typeorm-adapter";
import {CustomCasbinRule} from "./modules/authorization/casbin.entity";

let entity_list : (Function | string | EntitySchema<any>)[] = [User, UserProfile, Roles, Notification, CustomCasbinRule] as (Function | string | EntitySchema<any>)[]

export let casbin_adapter : TypeORMAdapter;
TypeORMAdapter.newAdapter({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_LOCAL,
    },
    {
        customCasbinRuleEntity: CustomCasbinRule,
    },
).then((a: TypeORMAdapter)=> casbin_adapter = a)

export const AppDataSource : DataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_LOCAL,
    synchronize: true,
    logging: ["error"],
    poolSize: 10,
    entities: entity_list,
    namingStrategy: new SnakeNamingStrategy(),
    cache: {
        duration: 1000
    },
    subscribers: [PasswordEncryptionSubscriber] as (Function)[],
    migrationsRun: true
})
