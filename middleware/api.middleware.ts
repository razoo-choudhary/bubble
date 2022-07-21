import {Response, Request, NextFunction} from "express";
import jwt from "jsonwebtoken";

export class ApiMiddleware{

    static async checkToken( request : Request, response : Response , Next : NextFunction){
        try{
            const token = await ApiMiddleware.getToken(request) ? await ApiMiddleware.getToken(request) : ""
            if(token && await jwt.verify(token,process.env.APP_KEY ? process.env.APP_KEY : "x" )){
                return Next()
            }
        }catch (e) {
            return response.json({ "message"  : "something wrong with token"})
        }
    }

    static async getToken(req : Request) {
        if (
            req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
            return req.headers.authorization.split(" ")[1];
        }
        return null;
    }
}