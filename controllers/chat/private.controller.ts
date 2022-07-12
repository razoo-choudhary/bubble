import {PrivateChatList} from "../../entities/PrivateChatList";
import {User} from "../../entities/User";
import {ChatMessages} from "../../entities/ChatMessages";
import {Functions} from "../../app/Common/functions";
import {ContactController} from "../contacts/contact.controller";
import {MessageAttachment} from "../../entities/MessageAttachment";
import moment from "moment";
import {SocketController} from "../socket/socket.controller";

export class PrivateController {

    /**
     *
     * @param user_id
     * @constructor
     */
    static async GetPrivateChatList ( user_id : number ) {
        const chatUserList : any = [];
        const chatLists : any = await PrivateChatList.find( { where : [{ to_user_id : user_id }] })
        for (const data of chatLists) {
            const opposingUser = await User.findOneBy({ user_id : data.from_user_id })
            if(opposingUser){
                const unreadChatLastMessage = await PrivateController.GetPrivateChatUnreadAndLastMessage(user_id, opposingUser.user_id)
                if(await ContactController.CheckIfFriends(user_id, opposingUser.user_id)){
                    chatUserList.push({ opposingUser, unreadChatLastMessage })
                }
            }
        }
        chatUserList.sort(function(a : any,b : any){
            const dateD : any = new Date(b.unreadChatLastMessage.messageTime)
            const dateB : any = new Date(a.unreadChatLastMessage.messageTime)
            return dateD - dateB;
        });
        return chatUserList;
    }

    /**
     *
     * @param from_user_id
     * @param to_user_id
     * @constructor
     */
    static async GetPrivateChatMessages (from_user_id : number, to_user_id : number ) {
        const MessagesWithMetaData = [];
        const privateMessages : any = await ChatMessages.find( {
            where : [
                { sender_user_id    : from_user_id, receiver_user_id : to_user_id },
                { receiver_user_id  : from_user_id, sender_user_id   : to_user_id }
            ],
            order : { chat_messages_id : "DESC"},

        })

        for(const privateMessage of privateMessages){
            privateMessage.type     =   await MessageAttachment.findOneBy({message_id : privateMessage.chat_messages_id})
            privateMessage.sender   =   await User.findOneBy({user_id : privateMessage.sender_user_id})
            MessagesWithMetaData.push(privateMessage)
        }
        return MessagesWithMetaData.reverse()
    }

    /**
     *
     * @param loggedInUserId
     * @constructor
     */
    static async LoadAllPrivateChatUnreadCount( loggedInUserId : number ){
        const messages = await ChatMessages.find({
            where : [{ receiver_user_id : loggedInUserId, is_read : 0 }]
        })
        return messages.length
    }

    /**
     *
     * @param fromUserId
     * @param whoseUserID
     * @constructor
     */
    static async GetPrivateChatUnreadAndLastMessage (fromUserId : number, whoseUserID : number) {
        const returnArray : any = {};
        const count = await ChatMessages.find({
            where : [
                { sender_user_id : whoseUserID, receiver_user_id : fromUserId, is_read : 0 }
            ]
        })
        const message = await  ChatMessages.findOne({
            where : [
                { sender_user_id      : fromUserId, receiver_user_id    : whoseUserID },
                { receiver_user_id    : fromUserId, sender_user_id      : whoseUserID }
            ],
            order : { chat_messages_id : "DESC" }
        })

        const attachment = await MessageAttachment.findOneBy( { message_id : message?.chat_messages_id } );
        returnArray.message     = message?.message_text
        if(attachment){
            returnArray.message = 'Attachment'
        }
        returnArray.count       = count.length;
        returnArray.messageTime = message?.created_at
        return returnArray;
    }

    /**
     *
     * @param initiator
     * @param opposingUsername
     * @constructor
     */
    static async MarkAllPrivateMessagesRead(initiator : number, opposingUsername : string ){
        const opposing = await User.findOne({ where : { username : Functions.SanitizeInput(opposingUsername) }})
        if(opposing){
            return await ChatMessages.update({ sender_user_id : opposing.user_id,  receiver_user_id : initiator}, {
                is_read : 1
            })
        }
    }

    /**
     *
     * @param from_user_id
     * @param to_user_id
     * @constructor
     */
    static async GetChatMutedStatus ( from_user_id : number , to_user_id : number) {
        return await PrivateChatList.findOneBy({
            from_user_id, to_user_id
        })
    }

    /**
     *
     * @param messageSender
     * @param messageReceiver
     * @param chatMessage
     * @param data
     * @param attachmentData
     */
    static async newPrivateMessageSocketRequest(messageSender : any, messageReceiver : any, data : any, chatMessage : any, attachmentData : any){
        await PrivateController.checkCreateNewChat(messageSender.user_id, messageReceiver.user_id);
        if(!chatMessage) chatMessage = await ChatMessages.save({message_text : Functions.SanitizeInput(data.message_text ? data.message_text : ""), sender_user_id : messageSender.user_id, receiver_user_id : messageReceiver.user_id, is_read : 0})
        if(attachmentData === null) attachmentData = await MessageAttachment.findOneBy({message_id : chatMessage.chat_messages_id})
        await PrivateController.MarkAllPrivateMessagesRead( messageSender.user_id, messageReceiver.username)
        const lastMessageWithCount  =   await PrivateController.GetPrivateChatUnreadAndLastMessage(messageReceiver.user_id,messageSender.user_id)
        await SocketController.sendResponse({
            "contentMeta"       :   chatMessage,
            "sidebarMeta"       :   lastMessageWithCount,
            "created_at"        :   moment(data.created_at).format("hh:mm"),
            "countOfUnread"     :   lastMessageWithCount.count,
            "chatMutedStatus"   :   await PrivateController.GetChatMutedStatus(messageReceiver.user_id,messageSender.user_id),
            fromMeta            :   messageSender,
            toMeta              :   messageReceiver,
            attachmentData
        })
    }

    /**
     *
     * @param sender
     * @param receiver
     * @private
     */
    static async checkCreateNewChat ( sender : number, receiver : number ){
        if(sender !== receiver){
            await PrivateChatList.findOneBy({ from_user_id : sender, to_user_id : receiver }).then( (data) => {
                if(!data){
                    PrivateChatList.save({
                        from_user_id : sender,
                        to_user_id   : receiver
                    })
                }
            })
            await PrivateChatList.findOneBy({ from_user_id : receiver, to_user_id : sender }).then( (data) => {
                if(!data){
                    PrivateChatList.save({
                        from_user_id : receiver,
                        to_user_id   : sender
                    })
                }
            })
        }
    }
}