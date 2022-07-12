import {Response, Request} from "express"
import {AppConfig} from "../../app/Common/appConfig";
import passport from "passport";
import {User} from "../../entities/User";
import bcrypt from "bcryptjs";
import {Functions} from "../../app/Common/functions";

export class SigninController {

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static LoadView( request : Request, response : Response ){
        return response.status(200).render('authentication/signin', {
            title       :   AppConfig.config().app_name + " | " + "Sign in",
            layout      :   "container",
            pageName    :   "signin",
            config      :   AppConfig.config(),
            navExplicit :   true,
        })
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     * @constructor
     */
    static PreAuthenticate ( request: Request, response : Response, next : () => void ){
        passport.authenticate("local",( error, user, info ) => {
            if ( error ) return response.status(500).json ( error );
            if ( !user ) return response.status(401).json({message : info.message});
            request.login( user, function ( error ) {
                if ( error ) return response.status(500).json( error );
                return response.json({
                    "location" : "/"
                })
            });
        }) ( request, response, next )
    }

    /**
     *
     * @param email
     * @param password
     * @param done
     * @constructor
     */
    static AuthenticateUser = async ( email : string, password : string, done : any) => {
        await User.findOneBy( { user_email : Functions.SanitizeInput(email) } ).then( async ( user ) => {

            if(!user) return done( null, false, {
                message : "No user with such email."
            })

            const match = await bcrypt.compare(Functions.SanitizeInput(password), user.user_password)

            if(match) return done( null, user, null)
            return done(null, false, {
                message : "Incorrect password for given email"
            })
        })
    }

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static SignOut ( request : Request, response : Response) {
        if(request.isAuthenticated()){
            request.logout( async ( ) => {
                response.status(200).redirect("/")
            })
        }
    }
}