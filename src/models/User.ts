import { UserInterface } from '../@types/interfaces/UserInterface';
import { hash } from 'bcrypt';
import { connect } from '../connectors/sql.connector';

export class User implements UserInterface {
    login: string;
    password: string;
    userId?: number;
    email?: string;
    fullName?: string;

    constructor(
        login: string,
        password: string,
        email?: string,
        fullName?: string,
        id?: number
    ) {
        this.login = login;
        this.password = password;
        this.email = email ? email : 'undefined';
        this.fullName = fullName ? fullName : 'undefined';
        if (id) {
            this.userId = id;
        }
    }

    async save(): Promise<string> {
        const conn = await connect();
        await conn.query(
            'INSERT INTO users (login, password, email, fullName) VALUES (?) ;',
            [[this.login, this.password, this.email, this.fullName]]
        );
        return `User ${this.login} saved`;
    }

    static async getUserData(id: number): Promise<User[]>;
    static async getUserData(login: string): Promise<User[]>;
    static async getUserData(arg: string | number): Promise<User[]> {
        const param = typeof arg === 'string' ? 'login' : 'userId';
        const conn = await connect();
        const query = await conn.query(`SELECT * FROM users WHERE ${param}=?`, [
            arg
        ]);
        return JSON.parse(JSON.stringify(query))[0];
    }

    static async exists(login: string): Promise<boolean> {
        const entries = await User.getUserData(login);
        return entries.length !== 0 ? true : false;
    }
}
