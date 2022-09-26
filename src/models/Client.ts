import connection from '../connectors/sql.connector';
import { IClient } from '../@types/interfaces/IClient';
import { Otp } from '../@types/Otp';
import { Photo } from './Photo';
import { getQueryResult } from '../service/query.service';

export class Client implements IClient {
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

    async setFolder(): Promise<void> {
        this.selfieFolder = await Photo.generateName();
    }
    async save(): Promise<void> {
        await connection.query(
            'INSERT IGNORE INTO clients (number, name, email, selfieLink, selfieFolder, token, expires) VALUES (?)',
            [[this.number, this.name, this.email, this.selfieLink, this.selfieFolder, this.token, this.expires]]
        );
    }

    async updateOtp(): Promise<void> {
        await connection.query('UPDATE clients SET token=?, expires=? WHERE number=?', [
            [this.token],
            [this.expires],
            [this.number]
        ]);
    }

    async setNewNumber(number: string): Promise<void> {
        await connection.query('UPDATE clients SET newNumber=? WHERE number=?', [[number], [this.number]]);
    }

    static async verifyChangeNumber(client: Client, number: string): Promise<boolean> {
        const result = getQueryResult(
            await connection.query('SELECT newNumber FROM clients WHERE number=?', [[client.number]])
        );
        const newNumber = result[0].newNumber;
        return number === newNumber;
    }

    static async changeNumber(client: Client, number: string): Promise<void> {
        await connection.query('UPDATE clients SET number=?, newNumber="undefined" WHERE number=?', [
            [number],
            client.number
        ]);
    }

    static async getData(number: string | undefined): Promise<Client | undefined> {
        const result = getQueryResult(await connection.query('SELECT * FROM clients WHERE number=?', [[number]]));
        return result[0];
    }

    static async setSelfie(client: Client, link: string): Promise<void> {
        await connection.query('UPDATE clients SET selfieLink=? WHERE number=?', [[link], [client.number]]);
    }

    static async setPersonalData(client: Client, name: string | undefined, email: string | undefined) {
        await connection.query('UPDATE clients SET name=?, email=? WHERE number=?', [[name], [email], [client.number]]);
    }
}
