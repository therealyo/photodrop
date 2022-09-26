import { IPhoneNumber } from './../@types/interfaces/IPhoneNumber';
import connection from '../connectors/sql.connector';
import { Photo } from './Photo';

export class PhoneNumber implements IPhoneNumber {
    countryCode: string;
    phoneNumber: string;
    userId?: number;
    number?: string;

    constructor(countryCode: string, number: string, userId?: number) {
        this.countryCode = countryCode;
        this.phoneNumber = number;
        this.userId = userId;
    }

    static async getId(num: PhoneNumber): Promise<number | undefined> {
        try {
            const query = (await connection.query('SELECT numberId FROM numbers WHERE number=?', [
                [num.countryCode + num.phoneNumber]
            ])) as any;
            return query[0][0].numberId;
        } catch (err) {
            return undefined;
        }
    }

    static async save(phoneNumbers: PhoneNumber[]): Promise<void> {
        await PhoneNumber.saveNumbers(phoneNumbers);
        await PhoneNumber.saveUsersRelation(phoneNumbers);
    }

    private static async saveNumbers(phoneNumbers: PhoneNumber[]): Promise<void> {
        const numbers = phoneNumbers.map((num) => {
            return [num.countryCode + num.phoneNumber];
        });
        await connection.query('INSERT IGNORE INTO numbers (number) VALUES ?', [numbers]);
    }

    private static async saveUsersRelation(phoneNumbers: PhoneNumber[]): Promise<void> {
        const userNumberRelation = await Promise.all(
            phoneNumbers.map(async (num) => {
                return [num.userId, await PhoneNumber.getId(num)];
            })
        );
        await connection.query('INSERT IGNORE INTO usersPhones (userId, numberId) VALUES ?', [userNumberRelation]);
    }

    private static async savePhotosRelation(photos: Photo[]): Promise<void> {}
}
