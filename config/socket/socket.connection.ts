import {SocketOptions} from "./socket.options";
import {User} from "../../entities/User";
import {SocketController} from "../../controllers/socket/socket.controller";
import {GroupController} from "../../controllers/chat/group.controller";
import {ChatController} from "../../controllers/chat.controller";

export class SocketConnection {

    static connectionToken : string

    /**
     *
     * @constructor
     */
    static ConnectSocket () {
        SocketOptions.io.on( "connection", (socket: any ) => {
            if( socket.handshake.query.token ){
                this.connectionToken    =   socket.handshake.query.token
                User.update( { socket_token : this.connectionToken}, {socket_connection_id : socket.id }).then( async () => {
                    SocketController.newPrivateMessage( socket )
                    SocketController.newGroupMessage( socket )
                    await SocketController.changeUserActiveStatus( socket )
                    await GroupController.ConnectClientToGroups( socket )
                    await ChatController.newFileSend(socket)
                })
            }

            setInterval(async () => SocketController.DetachOfflineUsers(socket), 60000);

            socket.on("join-room", ( data : any ) => socket.join(data.room_id))

            socket.once("disconnect", async () => {
                const matchingSocket = await SocketOptions.io.in(socket.id).allSockets();
                const isDisconnected = matchingSocket.size === 0;
                if(isDisconnected) await SocketController.DetachOfflineUsers( socket )
            })
        })
    }
}