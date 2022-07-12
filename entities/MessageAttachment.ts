import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Constants} from "../app/helpers/constants";

@Entity( Constants.Table.T_MESSAGES_ATTACHMENTS)
export class MessageAttachment  extends BaseEntity{
    @PrimaryGeneratedColumn()
    attachment_id !: number

    @Column({
        type : "integer",
    })
    message_id !: number

    @Column({
        type : "enum",
        enum : ["text", "image", "file"],
        default : "text",
    })
    message_type !: string

    @Column({
        type : "text",
        default : null
    })
    file_name !: string

    @Column({
        type : "text",
        default : null
    })
    file_size !: string

    @Column({
        type : "text",
        default : null
    })
    file_original_name !: string

    @CreateDateColumn()
    created_at !: Date

    @UpdateDateColumn()
    updated_at !: Date
}