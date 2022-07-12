import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Constants} from "../app/helpers/constants";

@Entity( Constants.Table.T_FRIEND_LIST )
export class FriendList extends BaseEntity{
    @PrimaryGeneratedColumn()
     id !: number

    @Column({
        type : "integer"
    })
    user_id !: number

    @Column({
        type : "integer"
    })
    friend_user_id !: number

    @Column({
        type : "integer",
        default : 0
    })
    invitation_accepted !: number

    @Column({
        type : "text",
        default: null
    })
    invitation_message !: string

    @CreateDateColumn()
    created_at !: Date

    @UpdateDateColumn()
    updated_at !: Date
}