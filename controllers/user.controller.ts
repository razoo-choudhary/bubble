import { Response, Request } from "express";
import {User} from "../entities/User";
import {AuthMiddleware} from "../middleware/auth.middleware";
import {Functions} from "../app/Common/functions";

export class UserController{

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static async Update( request : Request, response : Response ){
        const { todo } = request.body;
        if(todo === "dark-mode") await UserController.UpdateAppearance( request, response )
        if(todo === "update-active-status") await  UserController.UpdateActiveStatus( request, response)
        if(todo === "generate-random-avatar") await UserController.GenerateAvatar(request, response )
        if(todo === "change-user-full-name") await UserController.UpdateUserFullName( request, response )
    }

    /**
     *
     * @constructor
     */
    static async GetAllOfflineUsers(){
        const OfflineUsers  =   []
        const allUsers      =   await User.find();
        for(const user of allUsers){
            const UserLastSeen = Functions.CalculateOnlineStatus(user.last_seen);
            if(UserLastSeen > 0) OfflineUsers.push(user)
        }
        return OfflineUsers
    }

    /**
     *
     * @param user_id
     * @constructor
     * @private
     */
    static async GetSocketIdUsingUserId ( user_id : any){
        const data = await User.findOneBy({user_id : user_id})
        if(data) return data.socket_connection_id
    }

    /**
     *
     * @param request
     * @param response
     * @constructor
     * @private
     */
    private static async UpdateActiveStatus ( request : Request, response : Response) {
        await UserController.UpdateUser(request, { last_seen : new Date().toString() }).then( () => {
            return response.status(200).json({ "message" : true })
        })
    }

    /**
     *
     * @param request
     * @param response
     * @constructor
     * @private
     */
    private static async UpdateAppearance ( request : Request, response : Response){
        const newMode       = request.body.mode;
        await UserController.UpdateUser(request,{ appearance_mode : Functions.SanitizeInput(newMode) }).then( () => {
            return response.status(200).json({ "message" : true })
        })
    }

    /**
     *
     * @param request
     * @param response
     * @constructor
     * @private
     */
    private static async GenerateAvatar( request : Request, response : Response ){
        const avatar = Functions.CreateUserAvatar('','','personas')
        await UserController.UpdateUser( request, {user_avatar : avatar}).then( () => {
            return response.status(200).json({ "location" : "/"})
        })
    }

    private static async UpdateUserFullName(request : Request, response : Response){
        if(request.body.name){
            const FullName = Functions.SanitizeInput(request.body.name).split(" ")
            await UserController.ChangeUserFullName(request, { first_name : Functions.UpperFirst(FullName[0]), last_name : Functions.UpperFirst(FullName[1] ?? "") }).then( () => {
                return response.status(200).json({"location" : "/"})
            })
        }
    }

    /**
     *
     * @param request
     * @param data
     * @constructor
     * @private
     */
    private static async UpdateUser( request : Request, data = {} ){
        const user : any    = await AuthMiddleware.LoggedInUser( request )
        await User.update( {user_id : user.user_id}, data)
    }

    private static async ChangeUserFullName( request : Request, data : any ){
        const user: any = await AuthMiddleware.LoggedInUser( request )
        await User.update( {user_id : user.user_id}, data)
    }
}