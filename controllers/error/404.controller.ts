import { Request, Response } from "express";
import {AppConfig} from "../../app/Common/appConfig";

export class _404 {

    /**
     *
     * @param request
     * @param response
     * @constructor
     */
    static LoadView ( request : Request, response : Response) {
        return response.status(200).render('error/404', {
            pageName    :   "404",
            layout      :   "container",
            title       :   AppConfig.config().app_name + " | 404 Not Found",
            config      :   AppConfig.config(),
            navExplicit :   false,
        })
    }
}