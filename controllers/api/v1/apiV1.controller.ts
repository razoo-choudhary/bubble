import {Request,Response} from "express";
import {ChatController} from "../../chat.controller";
import {PrivateController} from "../../chat/private.controller";
import {User} from "../../../entities/User";
import {ApiMiddleware} from "../../../middleware/api.middleware";
import jwt from "jsonwebtoken";
import {GroupController} from "../../chat/group.controller";
import {Group} from "../../../entities/Group";

export class ApiV1Controller{

    static async GetPrivateChatMessage( request : Request, response : Response ){
        const username  =   request.params.username
        const token     =   await ApiMiddleware.getToken( request )
        const chatUsername  = await User.findOneBy({ username })
        const decodedToken : any =  (token) ? jwt.decode(token) : { user_id : 0}
        const user          = await User.findOneBy({user_id : decodedToken.user_id})
        if(username && token && user?.username !== chatUsername?.username){
            if(chatUsername && user){
                return response.status(200).json({
                    chatContent : await ChatController.LoadMainChatContent( user.user_id, username),
                    chatStatus  : await PrivateController.GetChatMutedStatus( user.user_id, chatUsername.user_id),
                    groupChatCount : 1,
                    privateChatCount : await PrivateController.LoadAllPrivateChatUnreadCount( user.user_id ),
                })
            }
        }
    }


    static async GetGroupChatMessage( request : Request, response : Response ){
        const group = await Group.findOneBy({group_id : Number(request.params.id)})
        const token     = await ApiMiddleware.getToken( request )
        const decodedToken : any =  (token) ? jwt.decode(token) : { user_id : 0}
        const user          = await User.findOneBy({user_id : decodedToken.user_id})
        if(user && group){
            return response.status(200).json({
                chatContent :   await ChatController.LoadManChatContentForGroup( Number(request.params.id), user.user_id ),
                chatStatus  :   await  GroupController.GetChatMutedStatus( user.user_id, Number(request.params.id)),
                groupChatCount : 1,
                privateChatCount : await PrivateController.LoadAllPrivateChatUnreadCount( user.user_id ),
            })
        }
    }
}