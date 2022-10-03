import connection from '../connectors/sql.connector';
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

    static async save(user: User, numbers: string[]): Promise<void> {
        await PhoneNumber.saveNumbers(numbers);
        await PhoneNumber.saveUsersRelation(user, numbers);
    }

    private static async saveNumbers(numbers: string[]): Promise<void> {
        try {
            console.log(numbers);
            await connection.query('INSERT IGNORE INTO numbers (number) VALUES ?;', [
                numbers.map((number) => {
                    return [number];
                })
            ]);
        } catch (err) {
            console.log(err);
        }
    }

    private static async saveUsersRelation(user: User, numbers: string[]): Promise<void> {
        const userNumberRelation = await Promise.all(
            numbers.map(async (num) => {
                return [user.userId, await PhoneNumber.getId(num)];
            })
        );
        try {
            console.log(numbers);
            await connection.query('INSERT IGNORE INTO usersPhones (userId, numberId) VALUES ?;', [userNumberRelation]);
        } catch (err) {
            console.log(err);
        }
    }
}
