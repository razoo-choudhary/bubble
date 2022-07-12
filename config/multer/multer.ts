import multer from "multer"
import {Functions} from "../../app/Common/functions";

export class Multer{

    static MulterUpload = multer({ storage : this.InitMulter()}).array("files", 5);

    static InitMulter() {
        return multer.diskStorage({
            destination(req, file, cb) { cb(null, "./uploads") },
            filename(req, file: any, cb: any) {
                const {originalname : originalName} = file
                const someNameToSet = Functions.GenerateToken( 55 )
                const fileExtension = (originalName.match(/\.+[\S]+$/) || [])[0]
                cb(null, `${someNameToSet}${fileExtension}`)
            }
        })
    }
}