import express from 'express'
import * as core from "express-serve-static-core"
import {SocketOptions} from "./config/socket/socket.options"
import {openServer} from "./index"
import {SocketConnection} from "./config/socket/socket.connection"
import {MySqlService} from "./config/database/mySqlService"
import * as dotenv from "dotenv"
import {AuthMiddleware} from "./middleware/auth.middleware"
import {Nodemailer} from "./config/email/nodemailer";

export class Server{

    app : core.Application = express()

    /**
     *
     * @constructor
     */
    ServerInit ( ) {
        // Starting up the server
        dotenv.config({path: __dirname+'/.env'} )
        Server.InitializeApplicationModules()
        AuthMiddleware.InitializeAuth()
        Nodemailer.InitializeNodeMailer()
    }

    /**
     *
     * @constructor
     * @private
     */
    private static InitializeApplicationModules () {
        // Start Socket Server After MySQL database Connection
        MySqlService.InitializeMySqlDatabase().then( ( ) => {
            SocketOptions.InitializeSocket( openServer )
            SocketConnection.ConnectSocket()
        })
    }
}