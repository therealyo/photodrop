import { createPool, Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export default createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_MASTER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10
});
// export async function connect(): Promise<Pool> {
//     const connection = createPool({
//         host: process.env.DB_HOST,
//         port: parseInt(process.env.DB_PORT!),
//         user: process.env.DB_MASTER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//         connectionLimit: 10
//     });
//     return connection;
// }
