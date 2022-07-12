import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Constants} from "../app/helpers/constants";

@Entity( Constants.Table.T_USER_TOKEN )
export class PasswordResetToken extends BaseEntity{
    @PrimaryGeneratedColumn()
    token_id !: number

    @Column({ type: "integer"})
    user_id !: number

    @Column({ type: "text"})
    token !: string

    @CreateDateColumn()
    created_at !: Date

    @UpdateDateColumn()
    updated_at !: Date
}