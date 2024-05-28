import {CreateDateColumn, Entity, UpdateDateColumn} from "typeorm";
import {CasbinRule} from "typeorm-adapter";

@Entity('casbin_rule')
export class CustomCasbinRule extends CasbinRule {
    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
