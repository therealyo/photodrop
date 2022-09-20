import connection from '../connectors/sql.connector';
import { ClientInterface } from '../@types/interfaces/ClientInterface';
import { Otp } from '../@types/Otp';

export class Client implements ClientInterface {
    clientId?: number;
    number: string;
    selfieLink?: string;
    name?: string;
    email?: string;
    token: string;
    expires: Date;

    constructor(number: string, otp: Otp) {
        this.number = number;
        this.token = otp.token;
        this.expires = otp.expires;
    }

    async save() {
        await connection.query(
            'INSERT IGNORE INTO clients (number, name, email, selfieLink, token, expires) VALUES (?)',
            [
                [
                    this.number,
                    this.name,
                    this.email,
                    this.selfieLink,
                    this.token,
                    this.expires
                ]
            ]
        );
    }

    async updateOtp() {
        await connection.query(
            'UPDATE clients SET token=?, expires=? WHERE number=?',
            [[this.token], [this.expires], [this.number]]
        );
    }

    async updateNumber(number: string) {}

    static async getData(number: string): Promise<Client | undefined> {
        const res = (await connection.query(
            'SELECT * FROM clients WHERE number=?',
            [[number]]
        )) as any[];
        return res[0][0];
    }
}
