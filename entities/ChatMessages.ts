import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Constants} from "../app/helpers/constants";

@Entity( Constants.Table.T_CHAT_MESSAGES )
export class ChatMessages  extends BaseEntity{
    @PrimaryGeneratedColumn()
    chat_messages_id !: number

    @Column({
        type : "text",
        default : null
    })
    message_text !: string

    @Column({
        type : "integer"
    })
    sender_user_id !: number

    @Column({
        type : "integer",
        default : null
    })
    receiver_user_id !: number

    @Column({
        type : "integer",
        default : null
    })
    group_id !: number

    @Column({
        type : "integer",
        default : 0
    })
    deleted !: number

    @Column({
        type : "integer",
        default : 0
    })
    id_forwarded !: number

    @Column({
        type : "integer",
        default : 0
    })
    is_read !: number

    @Column({
        type : "integer",
        default : null
    })
    forwarded_from_message_id !: number

    @CreateDateColumn()
    created_at !: Date

    @UpdateDateColumn()
    updated_at !: Date
}