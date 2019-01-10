/* eslint-disable consistent-return */
import * as mysql from 'mysql';

class DatabaseUtil {
    constructor() {
        this.init();
    }

    init() {
        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: 'shopify-db',
            user: 'user',
            password: process.env.DB_KEY,
            database: 'shopify_db',
            dateStrings: true,
            multipleStatements: true,
        });
    }

    getConnection() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(connection);
            });
        });
    }

    async sendQuery(queryString, values) {
        const query = mysql.format(queryString, values);

        const connection = await this.getConnection();

        return new Promise((resolve, reject) => {
            connection.query(values !== undefined ? query : queryString, (err, rows, fields) => {
                connection.end();
                if (err) {
                    console.log(`Query: ${values !== undefined ? query : queryString}`);
                    reject(err);
                    return;
                }
                resolve({
                    rows,
                    fields,
                });
            });
        });
    }

    end() {
        this.pool.end();
    }
}

export default new DatabaseUtil();
