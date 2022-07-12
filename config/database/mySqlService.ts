import {DataSource} from "typeorm";
import path from "path"

export class MySqlService {

    /**
     * MySQL database connection instance
     * @constructor
     */
    public static async InitializeMySqlDatabase () {
        const AppDataSource = new DataSource({
            type        : "mysql",
            host        : process.env.MYSQL_HOST,
            username    : process.env.MYSQL_USERNAME,
            password    : process.env.MYSQL_PASSWORD,
            database    : process.env.MYSQL_DATABASE_NAME,
            port        : Number(process.env.MYSQL_PORT) || 3306,
            charset     : "utf8mb4",
            entities    : [ path.join(__dirname, '../../') + "/entities/*.{ts,js}"],
            synchronize : true
        })
        await AppDataSource.initialize()
    }
}