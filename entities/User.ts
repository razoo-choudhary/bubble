import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Constants} from "../app/helpers/constants";

@Entity( Constants.Table.T_USERS )
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    user_id !: number

    @Column( {
        type    :   "text"
    })
    first_name !: string

    @Column( {
        type    :   "text"
    })
    last_name !: string

    @Column( {
        type    :   "text"
    })
    username !: string

    @Column( {
        type    :   "text"
    })
    user_email !: string

    @Column( {
        type    :   "text"
    })
    user_password !: string

    @Column({
        type    :   "enum",
        default :   "light",
        enum    :   ["light", "dark"]
    })
    appearance_mode !: string

    @Column( {
        type : "text"
    })
    user_avatar !: string

    @Column({
        type : "text"
    })
    last_seen !: string

    @Column({
        type : "text",
        default : null
    })
    socket_token !: string

    @Column({
        type : "text",
        default : null
    })
    socket_connection_id !: string

    @CreateDateColumn()
    created_at !: Date

    @UpdateDateColumn()
    updated_at !: Date
}