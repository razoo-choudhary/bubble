import {Request, Response} from "express"
import {AppConfig} from "../../app/Common/appConfig"
import {User} from "../../entities/User"
import bcrypt from "bcryptjs"
import {Functions} from "../../app/Common/functions"

export class SignupController{

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static LoadView ( request : Request, response : Response ) {
        return response.status(200).render('authentication/signup', {
            title       :   AppConfig.config().app_name + " | " + "Sign up",
            layout      :   "container",
            pageName    :   "signup",
            config      :   AppConfig.config(),
            navExplicit :   true,
        })
    }

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static async Signup ( request: Request, response : Response ) {
        const { email, username, password, firstName, lastName } = request.body;
        let ErrorTrace = false;
        if(!email || !username || !password || !firstName || !lastName){
            ErrorTrace = true;
            return response.status(401).json({
                message : "Missing Credentials"
            })
        }

        await User.findOneBy( { user_email : email}).then ( ( user ) => {
            if( user ){
                ErrorTrace = true;
                return response.status(401).json({
                    message : "Email has already been taken"
                })
            }
        })

        await User.findOneBy( { username : username}).then ( ( user ) => {
            if( user ) {
                ErrorTrace = true;
                return response.status(401).json({
                    message : "username has already been taken"
                })
            }
        })

        if(!ErrorTrace){
            await bcrypt.hash(password,10).then( async ( hashedPassword: string )=> {
                await User.save( {
                    username        : Functions.SanitizeInput(username),
                    first_name      : Functions.UpperFirst(Functions.SanitizeInput(firstName)),
                    last_name       : Functions.UpperFirst(Functions.SanitizeInput(lastName)),
                    user_email      : Functions.SanitizeInput(email),
                    user_password   : hashedPassword,
                    user_avatar     : Functions.CreateUserAvatar(firstName, lastName),
                    last_seen       : new Date().toString()
                }).then( () => {
                    return response.status(200).json({ "location" : "/" })
                })
            })
        }
    }
}