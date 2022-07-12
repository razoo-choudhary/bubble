import {FriendList} from "../../entities/FriendList";
import {User} from "../../entities/User";
import {Request, Response} from "express";
import {Functions} from "../../app/Common/functions";
import {AuthMiddleware} from "../../middleware/auth.middleware";
import {SocketController} from "../socket/socket.controller";
import {SocketOptions} from "../../config/socket/socket.options";
import {UserController} from "../user.controller";

export class ContactController{

    /**
     *
     * @param user_id
     * @param requestAccepted
     * @param is_request
     * @constructor
     * @private
     */
    static async GetUserAllContactList(user_id : number, requestAccepted = 0, is_request = 0 ){
        const friendLists : any = [];
        let where = [ { user_id : user_id }, { friend_user_id : user_id } ];
        if(is_request === 1)  where = [{ friend_user_id : user_id }]
        await FriendList.find( { where}).then( async (friendUserLists) => {
            for(const friendUserList of friendUserLists){
                if(friendUserList.invitation_accepted === requestAccepted){
                    await User.find( { where : [ { user_id : friendUserList.user_id },{ user_id : friendUserList.friend_user_id } ] } ).then( (userLists : any) =>{
                        for(const userList of userLists){
                            if( userList.user_id !== user_id ){
                                userList['list_id'] = Functions.MakeJwtToken({ "for" : "friend-list", "initiator" : friendUserList.user_id, "request_to" : friendUserList.friend_user_id});
                                friendLists.push( userList )
                            }
                        }
                    })
                }
            }
            friendLists.sort((a : any, b : any) => a.first_name.localeCompare(b.first_name))
        })
        return friendLists
    }

    /**
     *
     * @param user_id
     * @param friend_id
     * @constructor
     */
    static async CheckIfFriends( user_id : number, friend_id : number){
        let isFriend = false;
        const AcceptedFriendLists  = await ContactController.GetUserAllContactList(user_id,1)
        AcceptedFriendLists.forEach( (data : any) => {
            if(friend_id === data.user_id){
                isFriend = true;
                return;
            }
        })
        return isFriend
    }

    /**
     *
     * @param request
     * @constructor
     */
    private static async GetFriendRequestData( request : Request){
        const { request_user_id } = request.body;
        if(request_user_id){
            const tokenData : any = Functions.ExtractFromJwt( request_user_id )
            return await FriendList.findOneBy({ user_id : tokenData.initiator, friend_user_id : tokenData.request_to });
        }
    }

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static async NewFriendRequest ( request : Request, response : Response ){
        let { email, invitation } = request.body;
        if(!email) return response.status(200).json({message : "Missing Fields"})
        if(email){
            email       = Functions.SanitizeInput(email)
            invitation  = Functions.SanitizeInput(invitation)
            await User.findOneBy({user_email : email}).then( async ( userData : any) => {
                if(!userData){
                    return response.status(200).json({ "message" : "Couldn't find user with this email" })
                }
                if(userData){
                    const loggedInUser : any = await AuthMiddleware.LoggedInUser(request)
                    if(loggedInUser.user_email === userData.user_email){
                        return response.status(200).json({
                            "message" : "Friend Requests Can Only Be Sent To Friends"
                        })
                    }
                    await FriendList.findOne({
                        where : [
                            { user_id :  loggedInUser.user_id, friend_user_id : userData.user_id },
                            { user_id :  userData.user_id, friend_user_id : loggedInUser.user_id }
                        ]
                    }).then ( async ( friendList ) => {
                        if(friendList){
                            if(friendList.invitation_accepted > 0){
                                return response.status(200).json({
                                    "message" : "You are already friend with " + userData.user_email
                                })
                            }

                            if(friendList.invitation_accepted < 1){
                                return response.status(200).json({
                                    "message" : "Your Friend Request Has Already Been Sent To " + userData.user_email
                                })
                            }
                        }
                        if(!friendList){
                            await FriendList.save({
                                user_id : loggedInUser.user_id,
                                friend_user_id : userData.user_id,
                                invitation_accepted : 0,
                                invitation_message : invitation
                            }).then( (friendList) => {
                                SocketController.newFriendRequestNotification( userData.socket_connection_id, loggedInUser,friendList )
                                return response.status(200).json({
                                    message     : "Friend Request Sent",
                                    requested   : true
                                })
                            })
                        }
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
    static async AcceptFriendRequest( request : Request, response : Response ){
        const friendList =  await ContactController.GetFriendRequestData( request )
        if(friendList){
            await FriendList.update({ id : friendList.id }, { invitation_accepted : 1}).then( async () => {
                const user = await User.findOneBy({ user_id : friendList.friend_user_id })
                const OpposingUser = await UserController.GetSocketIdUsingUserId(friendList.user_id)
                if(user){
                    SocketOptions.io.to(OpposingUser).emit("request-accepted", { user })
                    return response.status(200).json({
                        "message"  : "Request Accepted",
                        "accepted" : true,
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
    static async RejectFriendRequest( request : Request, response : Response ){
        const friendList =  await ContactController.GetFriendRequestData( request )
        if(friendList){
            await FriendList.delete({ id : friendList.id }).then( () => {
                return response.status(200).json({
                    "message"   : "Request Deleted",
                    "rejected"  : true,
                })
            })
        }
    }
}