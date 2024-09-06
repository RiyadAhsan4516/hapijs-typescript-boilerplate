import {DataSource, EntitySchema} from "typeorm"
import {Roles} from "./modules/roles/roles.entity";
import {Notification} from "./modules/notification/notification.entity";
import {PasswordEncryptionSubscriber} from "./helpers/passwordEncryptionSubscriber";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import TypeORMAdapter from "typeorm-adapter";
import {CustomCasbinRule} from "./modules/authorization/casbin.entity";
import {AuthTokensEntity} from "./modules/authentication/authTokens.entity";
import {UserAccountEntity} from "./modules/userAccount/userAccount.entity";

let entity_list: (Function | string | EntitySchema)[] =
    [
        UserAccountEntity, Roles, Notification, CustomCasbinRule, AuthTokensEntity,
    ] as (Function | string | EntitySchema)[]


let username: string | undefined = process.env.DB_USER;
let password: string | undefined = process.env.DB_PASSWORD;
let database: string | undefined = process.env.DB_LOCAL;

if (process.env.NODE_ENV == 'production') {
    username = process.env.DB_PROD_USER;
    password = process.env.DB_PROD_PASSWORD;
    database = process.env.DB_PROD;
}

export let casbin_adapter: TypeORMAdapter;
TypeORMAdapter.newAdapter({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username,
        password,
        database,
    },
    {
        customCasbinRuleEntity: CustomCasbinRule,
    },
).then((a: TypeORMAdapter) => casbin_adapter = a)

export const AppDataSource: DataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username,
    password,
    database,
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
