import {Functions} from "../Common/functions";
import moment from "moment";

export default{

    /**
     * Register all your helper functions
     */

    UpperFirst( string: string ) : string {
        return Functions.UpperFirst( string )
    },

    /**
     *
     * @param string
     * @constructor
     */
    CalculateOnlineStatus( string: string ) : number {
        return Functions.CalculateOnlineStatus(string)
    },

    /**
     *
     * @param time
     * @constructor
     */
    MomentFormat( time : string ) : string {
        return moment(time).format("hh:mm")
    },

    /**
     *
     * @param v1
     * @param operator
     * @param v2
     * @param options
     */
    ifCond( v1 : any, operator : any , v2 : any , options : any ) {
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    },

    /**
     *
     * @param objectModels
     * @param breakPointNumber
     */
    breakOnCount({objectModels } : {objectModels : object}) : any{
        return objectModels
    },

    ConvertBytes (value: number){
        return Functions.convertBytes(value);
    },

    DD ( value :  any) {
        console.log(value)
    }
}