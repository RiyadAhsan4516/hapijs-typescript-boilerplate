import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from 'typeorm';
import {hash} from 'bcryptjs';
import {UserAccountEntity} from "../modules/userAccount/userAccount.entity";

@EventSubscriber()
export class PasswordEncryptionSubscriber implements EntitySubscriberInterface<UserAccountEntity> {
    listenTo() {
        return UserAccountEntity;
    }

    async beforeInsert(event: InsertEvent<UserAccountEntity>) {
        event.entity.password = await hash(event.entity.password, 10);
    }

    async beforeUpdate(event: UpdateEvent<Partial<UserAccountEntity>>){
        if(event?.entity?.password) event.entity.password = await hash(event.entity.password, 10)
    }

}
