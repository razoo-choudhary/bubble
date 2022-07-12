import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Constants} from "../app/helpers/constants";

@Entity( Constants.Table.T_GROUP_CHAT_LIST )
export class GroupChatList extends BaseEntity{
    @PrimaryGeneratedColumn()
    group_chat_list_id !: number

    @Column({
        type : "integer"
    })
    group_id !: number

    @Column({
        type : "integer"
    })
    user_id !: number

    @Column({
        type : "integer",
        default : 0
    })
    is_chat_muted !: number

    @CreateDateColumn()
    created_at !: Date

    @UpdateDateColumn()
    updated_at !: Date
}