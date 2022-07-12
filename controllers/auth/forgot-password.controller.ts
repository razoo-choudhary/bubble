import {Request, Response} from "express";
import {AppConfig} from "../../app/Common/appConfig";
import {User} from "../../entities/User";
import {Functions} from "../../app/Common/functions";
import {Nodemailer} from "../../config/email/nodemailer";
import {PasswordResetToken} from "../../entities/PasswordResetToken";

export class ForgotPasswordController{

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static LoadView( request : Request, response : Response ){
        return response.status(200).render('authentication/forgot-password', {
            title       :   AppConfig.config().app_name + " | " + "Forgot Password",
            layout      :   "container",
            pageName    :   "forgot-password",
            config      :   AppConfig.config(),
            navExplicit :   true,
        })
    }

    /**
     *
     * @param user_id
     * @constructor
     */
    public static async DeleteExistingKeyOnNewRequest ( user_id : number) {
        await PasswordResetToken.delete({ user_id : user_id}).then( () => {
            return true;
        })
    }

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static async InitResetRequest ( request: Request, response : Response) {
        const { email } = request.body;
        if (!email) return response.status(401).json({ message : "Missing Credentials"})

        await User.findOneBy( { user_email : email }).then( async ( user ) => {

            if( !user ) return response.status(401).json({ message : "No associated account was found."})

            const ResetToken =  Functions.GenerateToken( 32 )
            await ForgotPasswordController.DeleteExistingKeyOnNewRequest( user.user_id).then( () => {
                PasswordResetToken.save({user_id : user.user_id,token   :   ResetToken}).then( () => {
                    Nodemailer.EmailService.sendMail({
                        from        :   "ryzennepal@gmail.com",
                        to          :   user.user_email,
                        subject     :   "Password Reset Request",
                        html        :   `${process.env.APP_URL}/reset-password/${ResetToken}`,
                    })
                    return response.status(200).json({ message : "Email with reset link has been sent" })
                })
            })
        })
    }
}