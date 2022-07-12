import {User} from "../../entities/User";
import {Functions} from "../../app/Common/functions";
import {PrivateController} from "../chat/private.controller";
import {UserController} from "../user.controller";
import {SocketOptions} from "../../config/socket/socket.options";
import {Group} from "../../entities/Group";
import {ContactController} from "../contacts/contact.controller";
import {GroupController} from "../chat/group.controller";

export class SocketController{

    /**
     *
     * @param socket
     */
    static async changeUserActiveStatus ( socket : any ) {
        await User.findOneBy({ socket_connection_id : socket.id }).then( async ( data : any ) => {
            await SocketController.DetachOfflineUsers(socket)
            if( data ){
                socket.broadcast.emit("user-online-change", {
                    status      :   "online",
                    user_id     :   data.user_id,
                    username    :   data.username,
                    avatar      :   data.user_avatar,
                    fullName    :   Functions.UpperFirst(data.first_name) + " " + Functions.UpperFirst(data.last_name)
                })
            }
        })
    }

    /**
     *
     * @param socketConnectionID
     * @param sender
     * @param friendList
     */
    static async newFriendRequestNotification ( socketConnectionID : string, sender : any, friendList : any  ) {
        if(socketConnectionID){
            SocketOptions.io.to(socketConnectionID).emit("new-friend-request-received", {
                requestedUserData   : sender,
                listId              : Functions.MakeJwtToken( {
                    "for"        :  "friend-list",
                    "initiator"  : friendList.user_id,
                    "request_to" : friendList.friend_user_id,
                })
            })
        }
    }

    /**
     *
     * @param socket
     * @constructor
     */
    static async DetachOfflineUsers ( socket : any ) {
        await UserController.GetAllOfflineUsers().then(  offlineUsers  => socket.broadcast.emit("offline-users", {
            offLineUsers : offlineUsers ,
            status       : "offline"
        }))
    }

    /**
     *
     * @param receiverUserID
     * @constructor
     */
    static async ThrowTotalUnreadCount ( receiverUserID : number ) {
        const user  = await User.findOneBy({user_id : receiverUserID})
        if(user){
            SocketOptions.io.to(user.socket_connection_id).emit("total-unread-count",{
                "privateUnreadAll"  :   await PrivateController.LoadAllPrivateChatUnreadCount( receiverUserID ),
                "groupUnreadAll"    : 1,
            })
        }
    }

    /**
     *
     * @param group_data
     * @param receiverUserId
     */
    static async newGroupChat ( group_data : any, receiverUserId : number ) {
        await UserController.GetSocketIdUsingUserId( receiverUserId ).then( ( socketId ) =>{
            SocketController.ThrowTotalUnreadCount( receiverUserId )
            SocketOptions.io.to(socketId).emit("new-group-chat-created",{
                group_data,
                socketId
            })
        })
    }

    /**
     *
     * @param socket
     */
    static newGroupMessage( socket : any){
        socket.on("new-group-message", async ( data : any  ) => {
            const messageSender     = await User.findOneBy({user_id : Number( data.from_user )})
            const groupTobeSent     = await Group.findOneBy({group_id : Number( data.group_id )})
            if(messageSender && groupTobeSent){
                await GroupController.newGroupMessageSocketRequest(messageSender, groupTobeSent,data,null, null)
            }
        })
    }

    /**
     *
     * @param socket
     * @private
     */
    static newPrivateMessage( socket : any ){
        socket.on("new-private-message", async ( data : any ) => {
            const messageReceiver   =   await User.findOneBy({user_id : Number(Functions.SanitizeInput(data.to_user))});
            const messageSender     =   await User.findOneBy({user_id : Number(Functions.SanitizeInput(data.from_user))})
            if(messageReceiver && messageSender && await ContactController.CheckIfFriends(messageSender.user_id, messageReceiver.user_id)){
                await PrivateController.newPrivateMessageSocketRequest(messageSender,messageReceiver,data,null,null)
            }
        })
    }

    /**
     *
     * @param data
     * @private
     */
    static async sendResponse ( data : any){
        await SocketController.ThrowTotalUnreadCount( data.toMeta.user_id )
        await SocketController.ThrowTotalUnreadCount( data.fromMeta.user_id )
        SocketOptions.io.to(data.toMeta.socket_connection_id).to(data.fromMeta.socket_connection_id).emit("new-private-message-received", data)
    }
}