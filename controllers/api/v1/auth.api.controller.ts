import {Request , Response} from "express";
import {User} from "../../../entities/User";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {SignupController} from "../../auth/signup.controller";

export class AuthApiController {

    static async validateAuth ( request : Request, response : Response ) {
        const user = await User.findOneBy({user_email : request.body.email ? request.body.email : "" })
        if(user) {
            const verifyPassword = await bcrypt.compare(request.body.password, user.user_password)
            if( verifyPassword ){
                jwt.sign({ user_id : user.user_id, user_username : user.username }, process.env.APP_KEY ? process.env.APP_KEY : "x", { }, function(err, token) {
                    return response.status(200).json({
                        message : "authenticated",
                        token
                    })
                });
            }else{
                return response.status(401).json({
                    message :   "Incorrect username or password"
                })
            }
        }else{
            return response.status(401).json({
                message : "No credentials"
            })
        }
    }


    static async createNewUser (request : Request, response : Response  ) {
        return SignupController.Signup( request, response )
    }
}