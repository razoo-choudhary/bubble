import {Functions} from "./functions";

export class AppConfig{

    static config = ()  => {
        return {
            "app_name"      :   Functions.UpperFirst(process.env.APP_NAME || "bubble"),
            "app_version"   :   process.env.APP_VERSION,
            "app_key"       :   process.env.APP_KEY,
            "app_mode"      :   process.env.APP_MODE,
            "app_url"       :   process.env.APP_URL
        }
    }
}