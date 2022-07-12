import * as express from 'express'
import {HomeController} from '../controllers/home.controller'
import {SigninController} from '../controllers/auth/signin.controller'
import {AuthMiddleware} from '../middleware/auth.middleware'
import {SignupController} from '../controllers/auth/signup.controller'
import {ForgotPasswordController} from '../controllers/auth/forgot-password.controller'
import {_404} from '../controllers/error/404.controller'
import {ResetPasswordController} from '../controllers/auth/reset-password.controller'
import {UserController} from "../controllers/user.controller";
import {ChatController} from "../controllers/chat.controller";
import {ContactController} from "../controllers/contacts/contact.controller";
import {GroupController} from "../controllers/chat/group.controller";
import {Multer} from "../config/multer/multer";

/**
 * All routes proceeding with / are directed here
 */

const Router = express.Router()

/**
 * Get Routes that requires authentication
 */

Router.get(  '/',                                   AuthMiddleware.AuthenticatedMiddleWare, HomeController.LoadView )
Router.get(  '/signout',                            AuthMiddleware.AuthenticatedMiddleWare, SigninController.SignOut )
Router.get(  '/chat/:username',                     AuthMiddleware.AuthenticatedMiddleWare, HomeController.LoadView )
Router.get(  '/get-chat-content/chat/:username',    AuthMiddleware.AuthenticatedMiddleWare, ChatController.LoadPrivateChatContent)
Router.get(  '/group/:id',                          AuthMiddleware.AuthenticatedMiddleWare, HomeController.LoadView )
Router.get(  '/get-chat-content/group/:id',         AuthMiddleware.AuthenticatedMiddleWare, ChatController.LoadGroupChatContent)
/**
 * Get Routes that doesn't require authentication
 */

Router.get(  '/signin',                  AuthMiddleware.NonAuthenticatedMiddleWare, SigninController.LoadView )
Router.get(  '/signup',                  AuthMiddleware.NonAuthenticatedMiddleWare, SignupController.LoadView )
Router.get(  '/forgot-password',         AuthMiddleware.NonAuthenticatedMiddleWare, ForgotPasswordController.LoadView )
Router.get(  '/reset-password/:token',   AuthMiddleware.NonAuthenticatedMiddleWare, ResetPasswordController.LoadView )

/**
 * Post Routes that required authentication
 */

Router.post( '/user',           AuthMiddleware.AuthenticatedMiddleWare, UserController.Update )
Router.post( '/chat/status',    AuthMiddleware.AuthenticatedMiddleWare, ChatController.MuteStatus)
Router.post( '/chat/send-file', AuthMiddleware.AuthenticatedMiddleWare, Multer.MulterUpload, ChatController.UploadFiles)
Router.post( '/group/create',   AuthMiddleware.AuthenticatedMiddleWare, GroupController.NewGroupChat)
Router.post( '/request/create', AuthMiddleware.AuthenticatedMiddleWare, ContactController.NewFriendRequest)
Router.post( '/request/accept', AuthMiddleware.AuthenticatedMiddleWare, ContactController.AcceptFriendRequest)
Router.post( '/request/reject', AuthMiddleware.AuthenticatedMiddleWare, ContactController.RejectFriendRequest)

/**
 * Post Routes that doesn't require authentication
 */

Router.post( '/signin',             AuthMiddleware.NonAuthenticatedMiddleWare, SigninController.PreAuthenticate )
Router.post( '/signup',             AuthMiddleware.NonAuthenticatedMiddleWare, SignupController.Signup )
Router.post( '/forgot-password',    AuthMiddleware.NonAuthenticatedMiddleWare, ForgotPasswordController.InitResetRequest )
Router.post( '/reset-password',     AuthMiddleware.NonAuthenticatedMiddleWare, ResetPasswordController.ChangePassword )

/**
 * Catch all routes and redirect to 404 not found error
 */
Router.get(  '*', _404.LoadView )
module.exports = Router