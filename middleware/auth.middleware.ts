import {PassportService} from "../config/passportService";
import passport from "passport";
import {NextFunction, Request, Response} from "express";
import {User} from "../entities/User";

export class AuthMiddleware {

    /**
     *
     * @constructor
     */
    static InitializeAuth () {
        PassportService.InitializePassport(passport,
            async (user_email : string) => await this.FindUserByEmail( user_email ),
              async (user_id: number) =>  await this.FindUserByUserId( user_id )
        )
    }

    /**
     *
     * @param request
     * @param response
     * @param Next
     * @constructor
     */
    static async AuthenticatedMiddleWare (  request : Request, response : Response, Next : NextFunction ) {
        if( request.isAuthenticated() ){
            await AuthMiddleware.UpdateLastSeen( request )
            return Next()
        }
        if(!request.xhr){
            return response.redirect( "/signin" )
        }
        if( !request.isAuthenticated()){
            return response.status(301).json({
                message : "No authenticated user found"
            })
        }
    }

    /**
     *
     * @param request
     * @param response
     * @param Next
     * @constructor
     */
    static NonAuthenticatedMiddleWare (  request : Request, response : Response, Next : NextFunction) {
        if( request.isAuthenticated() )  return response.redirect( "/" )
        Next()
    }
    /**
     *
     * @param request
     * @constructor
     */
    static async LoggedInUser ( request: Request ){
        return request.user;
    }

    /**
     *
     * @param request
     * @constructor
     */
    static async UpdateLastSeen ( request : Request ) {
        if( request.isAuthenticated() ){
            await AuthMiddleware.LoggedInUser( request ).then( async ( user : any ) => {
                await User.update( { user_id : user.user_id },{ last_seen : new Date().toString(), socket_token : request.sessionID } )
            })
            return true;
        }
        return false;
    }

    /**
     *
     * @param user_email
     * @constructor
     * @private
     */
    private static async FindUserByEmail ( user_email : string ) {
        return await User.findOneBy({ user_email : user_email})
    }

    /**
     *
     * @param user_id
     * @constructor
     * @private
     */
    private static async FindUserByUserId ( user_id : number) {
        return await User.findOneBy({user_id : user_id} )
    }
}