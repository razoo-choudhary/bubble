import passportLocal from "passport-local";
import {SigninController} from "../controllers/auth/signin.controller";

export class PassportService {

    /**
     *
     * @param passport
     * @param getUserByEmail
     * @param getUserById
     * @constructor
     */
    static InitializePassport ( passport : any, getUserByEmail : any, getUserById : any ){

        passport.use( new passportLocal.Strategy({usernameField: 'email'}, SigninController.AuthenticateUser))

        passport.serializeUser( (user : any, done : any ) => done( null, user.user_id ))

        passport.deserializeUser( async (user_id : any, done : any ) => done( null, await getUserById( user_id ) ))
    }
}