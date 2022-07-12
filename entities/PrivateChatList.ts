import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Constants} from "../app/helpers/constants";

@Entity( Constants.Table.T_PRIVATE_CHAT_LIST )
export class PrivateChatList extends BaseEntity{
    @PrimaryGeneratedColumn()
    private_chat_list_id !: number

    @Column({
        type : "integer"
    })
    from_user_id !: number

    @Column({
        type : "integer"
    })
    to_user_id !: number

    @Column({
        type : "integer",
        default : 0,
    })
    is_chat_muted !: number

    @CreateDateColumn()
    created_at !: Date

    @UpdateDateColumn()
    updated_at !: Date
}