import { v4 as uuidv4 } from 'uuid';

import connection from '../connectors/sql.connector';

export class User {
    login: string;
    password: string;
    userId?: string;
    email?: string;
    fullName?: string;

    constructor(login: string, password: string, email?: string, fullName?: string) {
        this.login = login;
        this.password = password;
        this.email = email ? email : 'undefined';
        this.fullName = fullName ? fullName : 'undefined';
        this.userId = uuidv4();
    }

    async save(): Promise<string> {
        await connection.query('INSERT INTO users (login, password, email, fullName) VALUES (?) ;', [
            [this.login, this.password, this.email, this.fullName]
        ]);
        return `User ${this.email} saved`;
    }
}
