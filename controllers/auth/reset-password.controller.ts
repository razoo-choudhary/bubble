import {Request, Response} from "express"
import {AppConfig} from "../../app/Common/appConfig"
import {PasswordResetToken} from "../../entities/PasswordResetToken"
import bcrypt from "bcryptjs"
import {User} from "../../entities/User";
import {ForgotPasswordController} from "./forgot-password.controller";

export class ResetPasswordController {

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static async LoadView( request : Request, response : Response ){
        await ResetPasswordController.validateResetToken( request.params.token ).then( ( tokenExists ) => {
            if(!tokenExists) return response.redirect("/")
            return response.status(200).render('authentication/reset-password', {
                title       :   AppConfig.config().app_name + " | " + "Reset Password",
                layout      :   "container",
                pageName    :   "reset-password",
                config      :   AppConfig.config(),
                navExplicit :   true,
                token       :   request.params.token
            })
        })
    }

    /**
     *
     * @param token
     */
    static async validateResetToken (token : string) {
        return await PasswordResetToken.findOneBy({token : token})
    }

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static async ChangePassword ( request : Request, response : Response) {
        const { token, password } = request.body
        if(!token || !password){
            return response.status(401).json({
                message : "Missing Credentials"
            })
        }
        await ResetPasswordController.validateResetToken( request.body.token ).then( async ( tokenData ) => {
            if(tokenData){
                User.update({ user_id : tokenData.user_id},{ user_password : await bcrypt.hash(password,10) }).then( async () => {
                    await ForgotPasswordController.DeleteExistingKeyOnNewRequest( tokenData.user_id ).then( () => {
                        return response.status(200).json({ location : "/" })
                    })
                })
            }
        })
    }
}