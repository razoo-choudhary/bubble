import * as express from 'express'
import {AuthApiController} from "../controllers/api/v1/auth.api.controller";
import {ForgotPasswordController} from "../controllers/auth/forgot-password.controller";
import {ResetPasswordController} from "../controllers/auth/reset-password.controller";
import {ApiMiddleware} from "../middleware/api.middleware";
import {ApiV1Controller} from "../controllers/api/v1/apiV1.controller";

/**
 * All routes proceeding with /api is directed here.
 */

const Router = express.Router()

Router.post(  '/auth',      AuthApiController.validateAuth)
Router.post(  '/signup',    AuthApiController.createNewUser)
Router.post(  '/forgot-password', ForgotPasswordController.InitResetRequest )
Router.post(  '/reset-password',  ResetPasswordController.ChangePassword )


Router.get(  '/chat/:username', ApiMiddleware.checkToken, ApiV1Controller.GetPrivateChatMessage)
Router.get(  '/group/:id',  ApiMiddleware.checkToken, ApiV1Controller.GetGroupChatMessage )

module.exports = Router
