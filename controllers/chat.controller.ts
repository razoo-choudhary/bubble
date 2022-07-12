import {User} from "../entities/User";
import {PrivateController} from "./chat/private.controller";
import {Request, Response} from "express";
import {AuthMiddleware} from "../middleware/auth.middleware";
import {Functions} from "../app/Common/functions";
import {ContactController} from "./contacts/contact.controller";
import {PrivateChatList} from "../entities/PrivateChatList";
import {Group} from "../entities/Group";
import {ChatMessages} from "../entities/ChatMessages";
import {GroupChatList} from "../entities/GroupChatList";
import {GroupController} from "./chat/group.controller";
import {SocketController} from "./socket/socket.controller";
import {MessageAttachment} from "../entities/MessageAttachment";

export class ChatController{
    /**
     *
     * @param loggedInUserId
     * @param chatDisplayUsername
     * @constructor
     */
    static async LoadMainChatContent (loggedInUserId : number, chatDisplayUsername : string) {
        const returnArray: any = {};
        const chatUser = await User.findOneBy({username: Functions.SanitizeInput(chatDisplayUsername)});
        if (chatUser && loggedInUserId !== chatUser.user_id) {
            if(await ContactController.CheckIfFriends(loggedInUserId, chatUser.user_id)){
                returnArray.user = chatUser
                returnArray.chatMessages = await PrivateController.GetPrivateChatMessages(loggedInUserId, chatUser.user_id)
            }
        }
        return returnArray;
    }

    /**
     *
     * @param id
     * @param LoggedInUser
     * @constructor
     */

    static async LoadManChatContentForGroup( id : number, LoggedInUser : number){
        const returnArray: any = {};
        const group =   await Group.findOneBy( { group_id : id } )
        if( await GroupChatList.findBy({group_id : id, user_id : LoggedInUser})){
            returnArray.group        =  group
            returnArray.user         =  await User.findBy( {user_id : LoggedInUser})
            returnArray.chatMessages =  await ChatController.GetGroupChatMessages(id)
        }
        return returnArray;
    }

    /**
     *
     * @param id
     * @constructor
     */
    static async GetGroupChatMessages(id : number){
        const MessagesWithMetaData = [];
        const groupChatMessages : any = await ChatMessages.find({ where : [ { group_id : id }], order : {chat_messages_id : "DESC"}});
        for(const groupChatMessage of groupChatMessages){
            groupChatMessage.type       = await MessageAttachment.findOneBy({ message_id : groupChatMessage.chat_messages_id});
            groupChatMessage.sender     = await User.findOneBy({user_id : groupChatMessage.sender_user_id})
            MessagesWithMetaData.push(groupChatMessage);
        }
        return MessagesWithMetaData.reverse();
    }

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static LoadPrivateChatContent(request : Request, response : Response){
        if(request.xhr){
            AuthMiddleware.LoggedInUser(request).then( async ( user : any ) => {
                const opposingUser = await User.findOneBy({username : request.params.username})
                if(opposingUser && await ContactController.CheckIfFriends(user.user_id, opposingUser.user_id)) {
                    await PrivateController.MarkAllPrivateMessagesRead( user.user_id, Functions.SanitizeInput(request.params.username))
                    await SocketController.ThrowTotalUnreadCount(user.user_id)
                    return response.status(200).render('partials/chat/content', {
                        user,
                        chatStatus  : await PrivateController.GetChatMutedStatus(user.user_id, opposingUser.user_id),
                        chatContent : await ChatController.LoadMainChatContent(user.user_id, (request.params.username) ? Functions.SanitizeInput(request.params.username) : ""),
                    })
                }
            })
        }
    }

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static async LoadGroupChatContent( request : Request, response : Response){
        if(request.xhr){
            await AuthMiddleware.LoggedInUser( request ).then( async ( user : any ) => {
                await GroupChatList.findOneBy({ user_id : user.user_id, group_id : Number(request.params.id)}).then( async ( GroupList : any ) => {
                    if(GroupList){
                        await SocketController.ThrowTotalUnreadCount( user.user_id )
                        return response.status(200).render('partials/chat/content', {
                            user,
                            chatStatus  : await GroupController.GetChatMutedStatus( user.user_id, Number(request.params.id) ),
                            chatContent : await ChatController.LoadManChatContentForGroup( Number(request.params.id), user.user_id ),
                        })
                    }
                })
            })
        }
    }

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static async MuteStatus( request: Request, response : Response){
        const { from_user_id, to_user_id , status, type } = request.body;
        if(type === "group"){
            await GroupChatList.update({ user_id : from_user_id, group_id : to_user_id }, { is_chat_muted : status }).then( () => {
                response.status(200).json({ status, from_user_id, to_user_id,
                    message : "success",
                    type
                })
            })
        }
        if(type === "private"){
            await PrivateChatList.update({ from_user_id, to_user_id },{ is_chat_muted : status }).then( () => {
                response.status(200).json({ status, from_user_id, to_user_id,
                    message : "success",
                    type
                })
            })
        }
    }

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static UploadFiles( request : Request, response : Response) {
        const uploadedImageNames = [];
        const filesF : any = request.files;
        for (const File of filesF){
            uploadedImageNames.push({
                fileOriginalName    : File.originalname,
                fileOriginalSize    : File.size,
                fileMakeUpName      : File.filename,
                fileType            : File.mimetype === "image/jpeg" ? "image" : "file"
            })
        }
        if(filesF.length === uploadedImageNames.length){
            return response.status(200).json( {
                files : uploadedImageNames
            })
        }
    }

    /**
     *
     * @param socket
     * @constructor
     */
    static async newFileSend (socket : any ){
        socket.on("new-file-send", async ( data : any ) => {
            for(const file of data.response.files){
                const messageSender = await User.findOneBy( {user_id : data.response.sender})
                await ChatMessages.save({
                    message_text     : data.response.caption,
                    sender_user_id   : data.response.sender,
                    receiver_user_id : data.response.typ === 'group' ? null : data.response.receiver,
                    group_id         : data.response.typ === "group" ? data.response.receiver : null,
                    is_read          : 0,
                }).then ( async ( chatMessage : any) => {
                    if(chatMessage){
                        await MessageAttachment.save({
                            message_id          : chatMessage.chat_messages_id,
                            message_type        : Functions.SanitizeInput(file.fileType),
                            file_name           : Functions.SanitizeInput(file.fileMakeUpName ),
                            file_size           : file.fileOriginalSize,
                            file_original_name  : Functions.SanitizeInput(file.fileOriginalName)
                        }).then( async ( messageAttachment : any ) => {
                            if((data.response.typ).toLowerCase() === "group"){
                                await GroupController.newGroupMessageSocketRequest(messageSender,await Group.findOneBy({group_id : Number(data.response.receiver)}), data,chatMessage, messageAttachment)
                            }
                            if((data.response.typ).toLowerCase() === "private"){
                                await PrivateController.newPrivateMessageSocketRequest(messageSender,await User.findOneBy({user_id  : Number(data.response.receiver) }), data,chatMessage, messageAttachment)
                            }
                        })
                    }
                })
            }
        })
    }
}