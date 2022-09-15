import { NumberInterface } from '../@types/interfaces/NumberInterface';
import connection from '../connectors/sql.connector';
import { Photo } from './Photo';

export class PhoneNumber implements NumberInterface {
    number: string;
    userId: number;

    constructor(number: string, userId: number) {
        this.number = number;
        this.userId = userId;
    }

    // async save(): Promise<PhoneNumber> {
    //     try {
    //         await connection.query('INSERT INTO numbers (num) VALUES (?)', [
    //             [this.number]
    //         ]);
    //     } catch (err) {}

    //     return this;
    // }

    // async exists(): Promise<boolean> {
    //     const entries = await this.getId();
    //     return !(entries === undefined);
    // }

    static async getId(num: string): Promise<number | undefined> {
        try {
            const query = (await connection.query(
                'SELECT numberId FROM numbers WHERE num=?',
                [[num]]
            )) as any;
            return query[0][0].numberId;
        } catch (err) {
            return undefined;
        }
    }

    static async save(phoneNumbers: PhoneNumber[]): Promise<void> {
        await PhoneNumber.saveNumbers(phoneNumbers);
        await PhoneNumber.saveUsersRelation(phoneNumbers);
    }

    private static async saveNumbers(
        phoneNumbers: PhoneNumber[]
    ): Promise<void> {
        const numbers = phoneNumbers.map((num) => {
            return [num.number];
        });
        await connection.query('INSERT IGNORE INTO numbers (num) VALUES ?', [
            numbers
        ]);
    }

    private static async saveUsersRelation(
        phoneNumbers: PhoneNumber[]
    ): Promise<void> {
        const userNumberRelation = await Promise.all(
            phoneNumbers.map(async (num) => {
                return [num.userId, await PhoneNumber.getId(num.number)];
            })
        );
        await connection.query(
            'INSERT INTO usersPhones (userId, numberId) VALUES ?',
            [userNumberRelation]
        );
    }

    private static async savePhotosRelation(photos: Photo[]): Promise<void> {}
}
