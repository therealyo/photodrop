import { parsePhoneNumber } from 'libphonenumber-js';

import connection from '../connectors/sql.connector';
import { ParsedNumber } from '../@types/ParsedNumber';
import { Client } from '../models/Client';
import { User } from '../models/User';

class PhoneService {
    async getId(number: string): Promise<number | undefined> {
        try {
            const query = (await connection.query('SELECT numberId FROM numbers WHERE number=?', [[number]])) as any;
            return query[0][0].numberId;
        } catch (err) {
            return undefined;
        }
    }

    async save(user: User, clients: Client[]): Promise<void> {
        await this.saveNumbers(clients);
        await this.saveUsersRelation(user, clients);
    }

    private async saveNumbers(clients: Client[]): Promise<void> {
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

    private async saveUsersRelation(user: User, clients: Client[]): Promise<void> {
        const userNumberRelation = clients.map((client) => {
            return [user.userId, client.clientId];
        });
        try {
            await connection.query('INSERT IGNORE INTO usersPhones (userId, clientId) VALUES ?;', [userNumberRelation]);
        } catch (err) {
            throw err;
        }
    }

    splitNumber(phoneNumber: string): ParsedNumber | undefined {
        const parsedNumber = parsePhoneNumber(phoneNumber);
        return {
            countryCode: `+${parsedNumber.countryCallingCode}`,
            number: parsedNumber.nationalNumber
        };
    }

    concatNumber(number: { countryCode: string; number: string }): string | undefined {
        try {
            return number.countryCode + number.number;
        } catch (err) {}
    }
}

export default new PhoneService();
