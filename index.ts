import * as express from "express"
import path from "path"
import bodyParser from "body-parser"
import {Server} from "./server"
import session from "express-session"
import passport from "passport"
import hbs from "hbs"
import {Functions} from "./app/Common/functions"
import cookieParser from "cookie-parser"
import hbsHelper from "./app/helpers/hbs"

const server    = new Server()
const app       = server.app

export const openServer = app.listen( process.env.APP_PORT || 5000 , ( ) => {

    const staticPath    =   path.join( __dirname, "/" )
    const viewPath      =   path.join( __dirname, "/resources/layouts" )
    const partialPath   =   path.join( __dirname, "/resources/layouts/partials" )
    const hbsUtils      =   require('hbs-utils')(hbs);

    app.set( "view engine", "hbs")
    app.set( "views", viewPath)

    app.use( express.static( staticPath ))
    app.use( bodyParser.urlencoded( {extended : true, limit : "20gb"} ))
    app.use( bodyParser.json({limit : "20gb"}) )
    app.use(cookieParser())
    app.use( session({
        secret: process.env.APP_KEY || Functions.GenerateToken(32),
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge : 500 * 60 * 60 * 1000,
        },
    }))
    app.use( passport.initialize() )
    app.use( passport.session() )

    //@ts-ignore
    hbs.registerHelper(  hbsHelper  )
    hbsUtils.registerPartials( partialPath );
    hbsUtils.registerWatchedPartials( partialPath );

    app.use( "/api", require("./routes/api") )
    app.use( require("./routes/web") )

    server.ServerInit()
})