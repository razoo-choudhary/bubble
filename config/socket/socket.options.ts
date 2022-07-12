export class SocketOptions {

    static io: any;

    /**
     *
     * @param server
     * @constructor
     */
    static InitializeSocket(server: any) {
        SocketOptions.io = require("socket.io")( server, {
            cors : {
                origin : "*"
            }
        })
        return SocketOptions.io;
    }
}