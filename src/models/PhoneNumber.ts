import connection from '../connectors/sql.connector';
import { Client } from './Client';
import { User } from './User';

export class PhoneNumber {
    countryCode: string;
    phoneNumber: string;
    userId?: number;
    number?: string;

    constructor(countryCode: string, number: string, userId?: number) {
        this.countryCode = countryCode;
        this.phoneNumber = number;
        this.userId = userId;
    }

    static async getId(number: string): Promise<number | undefined> {
        try {
            const query = (await connection.query('SELECT numberId FROM numbers WHERE number=?', [[number]])) as any;
            return query[0][0].numberId;
        } catch (err) {
            return undefined;
        }
    }

    static async save(user: User, clients: Client[]): Promise<void> {
        await PhoneNumber.saveNumbers(clients);
        await PhoneNumber.saveUsersRelation(user, clients);
    }

    private static async saveNumbers(clients: Client[]): Promise<void> {
        try {
            await connection.query('INSERT IGNORE INTO clients (clientId, number) VALUES ?;', [
                clients.map((client) => {
                    return [client.clientId, client.number];
                })
            ]);
        } catch (err) {
            throw err;
        }
    }

    private static async saveUsersRelation(user: User, clients: Client[]): Promise<void> {
        const userNumberRelation = clients.map((client) => {
            return [user.userId, client.clientId];
        });
        try {
            await connection.query('INSERT IGNORE INTO usersPhones (userId, clientId) VALUES ?;', [userNumberRelation]);
        } catch (err) {
            throw err;
        }
    }
}
