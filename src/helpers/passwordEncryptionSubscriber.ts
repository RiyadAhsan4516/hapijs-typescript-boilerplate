import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import {User} from "../userAccount/userAccount.entity";
import bcrypt from 'bcryptjs';

@EventSubscriber()
export class PasswordEncryptionSubscriber implements EntitySubscriberInterface<User> {
    listenTo() {
        return User;
    }

    async beforeInsert(event: InsertEvent<User>) {
        event.entity.password = await bcrypt.hash(event.entity.password, 10);
    }

    async beforeUpdate(event: UpdateEvent<User> | any){
        event.entity.password = await bcrypt.hash(event.entity.password, 10)
    }

}
