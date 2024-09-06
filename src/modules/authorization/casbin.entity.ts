import {Column, Entity} from "typeorm";
import {CasbinRule} from "typeorm-adapter";

@Entity('casbin_rule')
export class CustomCasbinRule extends CasbinRule {
    @Column({type: "date", nullable: true})
    created_at: Date;

    @Column({type: "date", nullable: true})
    updated_at: Date;
}
