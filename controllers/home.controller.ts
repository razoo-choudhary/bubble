import {Request, Response} from "express";
import {AppConfig} from "../app/Common/appConfig";
import {AuthMiddleware} from "../middleware/auth.middleware";
import {Functions} from "../app/Common/functions";
import {PrivateController} from "./chat/private.controller";
import {GroupController} from "./chat/group.controller";
import {ChatController} from "./chat.controller";
import {ContactController} from "./contacts/contact.controller";
import {User} from "../entities/User";

export class HomeController{

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static async  LoadView ( request: Request, response: Response) {
        AuthMiddleware.LoggedInUser(request).then( async ( user : any ) => {
            let chatContent : any, chatStatus  : any, navExplicit = false;

            // Determines Group Chat
            if(request.params.id && !request.params.username){
                chatContent =   await ChatController.LoadManChatContentForGroup( Number(request.params.id), user.user_id )
                chatStatus  =   await  GroupController.GetChatMutedStatus( user.user_id, Number(request.params.id))
                navExplicit =   true;
            }

            // Determines Private Chat
            if(request.params.username && user.username !== request.params.username && !request.params.id){
                const ChatUsername  = await User.findOneBy({username : request.params.username})
                if(ChatUsername   &&  await ContactController.CheckIfFriends(user.user_id, ChatUsername.user_id)){
                    await PrivateController.MarkAllPrivateMessagesRead( user.user_id, ChatUsername.username)
                    chatContent     = await ChatController.LoadMainChatContent( user.user_id,(request.params.username) ? request.params.username : "" )
                    chatStatus      = await PrivateController.GetChatMutedStatus(user.user_id,ChatUsername?.user_id)
                    navExplicit     = true;
                }
            }
            return await HomeController.LoadHomeViewResponseDate(request, response, user, chatStatus, chatContent, navExplicit)
        })
    }

    /**
     *
     * @param request
     * @param response
     * @param user
     * @param navExplicit
     * @param chatStatus
     * @param chatContent
     * @constructor
     */
    static async LoadHomeViewResponseDate(request : Request, response : Response, user : any, chatStatus : any, chatContent : any, navExplicit : boolean){
        return response.status(200).render('home/home', {
            pageName    :   "home",
            layout      :   "container",
            title       :   AppConfig.config().app_name + " | " + Functions.UpperFirst(user.first_name) + " " + Functions.UpperFirst(user.last_name),
            config      :   AppConfig.config(),
            contacts    :   await ContactController.GetUserAllContactList( user.user_id, 1 ),
            FrnRequest  :   await ContactController.GetUserAllContactList(user.user_id, 0,1),
            chatList    :   await PrivateController.GetPrivateChatList(user.user_id),
            groups      :   await GroupController.GetAllJoinedGroup( user.user_id ),
            privateChatCount : await PrivateController.LoadAllPrivateChatUnreadCount( user.user_id ),
            navExplicit,
            user,
            request,
            chatStatus,
            chatContent,
            groupChatCount  : 1
        })
    }
}