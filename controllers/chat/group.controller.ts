import {GroupChatList} from "../../entities/GroupChatList";
import {Group} from "../../entities/Group";
import {Request, Response} from "express";
import {AuthMiddleware} from "../../middleware/auth.middleware";
import {Functions} from "../../app/Common/functions";
import {SocketController} from "../socket/socket.controller";
import {User} from "../../entities/User";
import {ChatMessages} from "../../entities/ChatMessages";
import {MessageAttachment} from "../../entities/MessageAttachment";
import {SocketOptions} from "../../config/socket/socket.options";
import moment from "moment";

export class GroupController {

    /**
     *
     * @param groupJoiner
     * @constructor
     */
    static async GetAllJoinedGroup(groupJoiner : number ){
        const groups : any = [];
        const MyGroupList  = await GroupChatList.find({ where : { user_id : groupJoiner }});
        for(const groupList of MyGroupList){
            const group  = await Group.findOneBy({group_id: groupList.group_id})
            const count  = await this.GetGroupMessageUnreadCount( groupList.group_id )
            groups.push({ group, count })
        }
        return groups
    }

    /**
     *
     * @param group_id
     * @constructor
     */
    static async GetGroupMessageUnreadCount (group_id : number){
        return 0;
        //const  groupMessageCount = await ChatMessages.findBy({ group_id : group_id, is_read : 0 })
        //return groupMessageCount.length
    }

    /**
     *
     * @param socket
     * @constructor
     */
    static async ConnectClientToGroups( socket : any ){
        await User.findOneBy({socket_connection_id : socket.id}).then( async ( user : any ) => {
            const AllConnectedGroup = await GroupController.GetAllJoinedGroup( user.user_id)
            if(AllConnectedGroup.length > 0){
                for(const groups of AllConnectedGroup){
                    socket.join(groups.group.group_socket_id)
                }
            }
        })
    }

    /**
     *
     * @param user_id
     * @param group_id
     * @constructor
     */
    static async GetChatMutedStatus( user_id : number, group_id : number){
        return GroupChatList.findOneBy( {
            user_id,
            group_id
        } )
    }

    /**
     *
     * @param groupMembers
     * @param group
     * @constructor
     * @private
     */
    private static async CreateGroupMembers( groupMembers : Array<any>, group : any){
        let savedCount = 0;
        for (const groupMember of groupMembers){
            const saved = await GroupChatList.save({ group_id : group.group_id, user_id  : Number(groupMember) })
            if(saved){
                await SocketController.newGroupChat(group, Number(groupMember))
                savedCount += 1;
            }
        }
        return savedCount === groupMembers.length;
    }

    /**
     *
     * @param messageSender
     * @param groupTobeSent
     * @param chatMessage
     * @param data
     * @param attachmentData
     */
    static async newGroupMessageSocketRequest(messageSender : any, groupTobeSent : any, data : any, chatMessage : any , attachmentData : any) {
        await GroupChatList.findOneBy({user_id : messageSender.user_id, group_id : groupTobeSent.group_id}).then( async ( GroupChatL : any) => {
            if(GroupChatL){
                if(chatMessage === null) chatMessage = await ChatMessages.save({ message_text : Functions.SanitizeInput(data.message_text ? data.message_text : ""), sender_user_id  : messageSender.user_id, group_id : groupTobeSent.group_id, is_read : 0})
                if(attachmentData === null) attachmentData = await MessageAttachment.findOneBy( { message_id : chatMessage.chat_messages_id } )
                SocketOptions.io.in(groupTobeSent.group_socket_id).emit("group-message-received", {
                    contentMeta     :   chatMessage,
                    fromMeta        :   messageSender,
                    toMeta          :   groupTobeSent,
                    created_at      :   moment(chatMessage.created_at).format("hh:mm"),
                    unreadCount     :   0,
                    chatMutedStatus :   await GroupChatList.findBy({ group_id : groupTobeSent.group_id}),
                    attachmentData
                })
            }
        })
    }

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static async NewGroupChat( request : Request, response : Response){
        await AuthMiddleware.LoggedInUser( request ).then( async ( user : any ) => {

            const group_members : Array<any> = request.body.group_members
            const { group_name, group_description } = request.body

            if(!group_name || !group_members || !group_description) return response.status(401).json({ message : "Missing Fields" })
            if(group_members && group_description && group_name){
                await Group.findOneBy({ admin_user_id : user.user_id, group_name : group_name.toLowerCase() }).then( async ( data ) => {
                    if(data){
                        return response.status(401).json({
                            message : "You are admin of a group that has the same name, Try different"
                        })
                    }
                    if(!data){
                        await Group.save({
                            group_name,
                            group_type      : "public",
                            group_image     : Functions.CreateUserAvatar(group_name,Functions.GenerateToken(15),'bottts'),
                            admin_user_id   : user.user_id,
                            group_socket_id : Functions.GenerateToken(25)
                        }).then( async (data) => {
                            await GroupController.CreateGroupMembers(group_members, data).then( ( res ) => {
                                if(res){
                                    return response.status(200).json({
                                        message :   "New Group Has Been Created",
                                        status  :   200,
                                        data
                                    })
                                }
                            })
                        })
                    }
                })
            }
        })
    }
}