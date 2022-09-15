import { Pool } from 'mysql2/promise';
import { NumberInterface } from '../@types/interfaces/NumberInterface';
import connection from '../connectors/sql.connector';

export class PhoneNumber implements NumberInterface {
    number: string;

    constructor(number: string) {
        this.number = number;
    }

    async save(): Promise<PhoneNumber> {
        try {
            await connection.query('INSERT INTO numbers (num) VALUES (?)', [
                [this.number]
            ]);
            // await conn.end();
        } catch (err) {}

        return this;
    }

    async exists(): Promise<boolean> {
        const entries = await this.getId();
        return !(entries === undefined);
    }

    async getId(): Promise<number | undefined> {
        try {
            const query = (await connection.query(
                'SELECT numberId FROM numbers WHERE num=?',
                [[this.number]]
            )) as any;
            return query[0][0].numberId;
        } catch (err) {
            return undefined;
        }
    }
}
