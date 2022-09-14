import { NumberInterface } from '../@types/interfaces/NumberInterface';
import { connect } from '../connectors/sql.connector';

export class PhoneNumber implements NumberInterface {
    number: string;

    constructor(number: string) {
        this.number = number;
    }
    async save() {
        const conn = await connect();
        await conn.query('INSERT INTO numbers (num) VALUES (?)', [
            [this.number]
        ]);
    }
}
