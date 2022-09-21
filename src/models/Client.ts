import connection from '../connectors/sql.connector';
import { ClientInterface } from '../@types/interfaces/ClientInterface';
import { Otp } from '../@types/Otp';
import { Photo } from './Photo';

export class Client implements ClientInterface {
    clientId?: number;
    number: string;
    selfieLink?: string;
    selfieFolder?: string;
    name?: string;
    email?: string;
    token: string;
    expires: Date;

    constructor(number: string, otp: Otp) {
        this.number = number;
        this.token = otp.token;
        this.expires = otp.expires;
    }

    async setFolder() {
        this.selfieFolder = await Photo.generateName();
    }
    async save() {
        await connection.query(
            'INSERT IGNORE INTO clients (number, name, email, selfieLink, selfieFolder, token, expires) VALUES (?)',
            [[this.number, this.name, this.email, this.selfieLink, this.selfieFolder, this.token, this.expires]]
        );
    }

    async updateOtp() {
        await connection.query('UPDATE clients SET token=?, expires=? WHERE number=?', [
            [this.token],
            [this.expires],
            [this.number]
        ]);
    }

    async setNewNumber(number: string) {
        await connection.query('UPDATE clients SET newNumber=? WHERE number=?', [[number], [this.number]]);
    }

    static async verifyChangeNumber(client: Client, number: string) {
        const query = (await connection.query('SELECT newNumber FROM clients WHERE number=?', [
            [client.number]
        ])) as any[];
        const newNumber = query[0][0].newNumber;
        return number === newNumber;
    }

    static async changeNumber(client: Client, number: string) {
        await connection.query('UPDATE clients SET number=?, newNumber="undefined" WHERE number=?', [
            [number],
            client.number
        ]);
    }

    static async getData(number: string | undefined): Promise<Client | undefined> {
        const res = (await connection.query('SELECT * FROM clients WHERE number=?', [[number]])) as any[];
        return res[0][0];
    }

    static async setSelfie(client: Client, link: string) {
        await connection.query('UPDATE clients SET selfieLink=? WHERE number=?', [[link], [client.number]]);
    }
}
