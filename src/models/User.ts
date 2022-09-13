import { UserInterface } from '../dtos/interfaces/User';
import { hash } from 'bcrypt';
import { connect } from '../connectors/sql.connector';

export class User implements UserInterface {
    login: string;
    password: string;
    email?: string;
    fullName?: string;

    constructor(
        login: string,
        password: string,
        email?: string,
        fullName?: string
    ) {
        this.login = login;
        this.password = password;
        this.email = email ? email : 'undefined';
        this.fullName = fullName ? fullName : 'undefined';
    }
    async save(): Promise<string> {
        const conn = connect();
        await (
            await conn
        ).query(
            'INSERT INTO users (login, password, email, fullName) VALUES (?) ;',
            [[this.login, this.password, this.email, this.fullName]]
        );
        return `User ${this.login} saved`;
    }

    static async getUserData(login: string): Promise<User[]> {
        const conn = await connect();
        const query = await conn.query('SELECT * FROM users WHERE login=?', [
            login
        ]);
        return JSON.parse(JSON.stringify(query))[0];
    }
    static async exists(login: string): Promise<boolean> {
        const entries = await User.getUserData(login);
        return entries.length !== 0 ? true : false;
    }
    static async checkPassword(): Promise<boolean> {
        return true;
    }
}
