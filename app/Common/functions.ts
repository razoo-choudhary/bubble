import moment from "moment";
import * as jwt from "jsonwebtoken";

export class Functions {

    /**
     *
     * @param input
     * @constructor
     */
    static SanitizeInput ( input : string ) : string {
        const map : any =
            {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
                '`': '&#x60;',
                '=': '&#x3D;',
            }
        input   =   input.replace(/[&<>"'/]/ig, (match) => (map[match]))
        input   =   input.replace(/\\/, "&#92;")
        return input
    }

    /**
     *
     * @param string
     * @constructor
     */
    static UpperFirst ( string : string) : string {
        string = this.SanitizeInput(string)
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    /**
     *
     * @param length
     * @constructor
     */
    static GenerateToken ( length : number) : string {
        const a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        const b = [];
        for (let i=0; i<length; i++) {
            const j = Number((Math.random() * (a.length-1)).toFixed(0));
            b[i] = a[j];
        }
        return b.join("");
    }

    /**
     *
     * @param first_name
     * @param last_name
     * @param type
     * @constructor
     */
    static CreateUserAvatar( first_name : string, last_name : string, type = "initials" ) : string {
        const diceBearUrl   =   "https://avatars.dicebear.com/api/"+type+"/";
        const initialFName       =   Array.from(first_name)[0];
        const initialLName       =   Array.from(last_name)[0];
        return diceBearUrl + initialFName + initialLName + Functions.GenerateToken( 25 ) +  ".svg"
    }

    /**
     *
     * @param string
     * @constructor
     */
    static CalculateOnlineStatus( string : string ){
        const currentTime   = moment(new Date());
        const momentTime    = moment(new Date(string));
        const difference    = currentTime.diff(momentTime, 'minutes')
        return difference > 0 ? difference : 0;
    }

    /**
     *
     * @param data
     * @constructor
     */
    static MakeJwtToken( data : any ){
        return jwt.sign(data, process.env.APP_KEY as string);
    }

    /**
     *
     * @param token
     * @constructor
     */
    static ExtractFromJwt ( token : string) {
        return jwt.verify(token, process.env.APP_KEY as string)
    }

    /**
     *
     * @param bytes
     */
    static convertBytes ( bytes : number) {
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

        if (bytes == 0) {
            return "n/a"
        }

        const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))))

        if (i == 0) {
            return bytes + " " + sizes[i]
        }

        return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
    }
}