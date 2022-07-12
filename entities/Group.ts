import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Constants} from "../app/helpers/constants";

@Entity( Constants.Table.T_GROUPS )
export class Group extends BaseEntity {
    @PrimaryGeneratedColumn()
    group_id !: number

    @Column({
        type : "text"
    })
    group_name !: string

    @Column({
        type : "text"
    })
    group_type !: string


    @Column({
        type : "text"
    })
    group_image !: string

    @Column({
        type : "integer",
        default : 0
    })
    admin_user_id !: number

    @Column({
        type : "text",
        default : null,
    })

    group_socket_id !: string

    @CreateDateColumn()
    created_at !: Date

    @UpdateDateColumn()
    updated_at !: Date
}