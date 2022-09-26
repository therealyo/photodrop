import { PhoneNumber } from './PhoneNumber';
import { UserInterface } from '../@types/interfaces/UserInterface';
import connection from '../connectors/sql.connector';
import { Album } from './Album';

export class User implements UserInterface {
    login: string;
    password: string;
    userId?: number;
    email?: string;
    fullName?: string;

    constructor(login: string, password: string, email?: string, fullName?: string, id?: number) {
        this.login = login;
        this.password = password;
        this.email = email ? email : 'undefined';
        this.fullName = fullName ? fullName : 'undefined';
        if (id) {
            this.userId = id;
        }
    }

    async save(): Promise<string> {
        await connection.query('INSERT INTO users (login, password, email, fullName) VALUES (?) ;', [
            [this.login, this.password, this.email, this.fullName]
        ]);
        return `User ${this.login} saved`;
    }

    static async getUserData(id: number): Promise<User[]>;
    static async getUserData(login: string): Promise<User[]>;
    static async getUserData(arg: string | number): Promise<User[]> {
        const param = typeof arg === 'string' ? 'login' : 'userId';
        const query = await connection.query(`SELECT userId, login, password FROM users WHERE ${param}=?`, [arg]);
        console.log(JSON.parse(JSON.stringify(query))[0]);
        return JSON.parse(JSON.stringify(query))[0];
    }

    static async exists(login: string): Promise<boolean> {
        const entries = await User.getUserData(login);
        return entries.length !== 0 ? true : false;
    }

    static async searchClient(user: User, contains: string): Promise<PhoneNumber | undefined> {
        const validNumber = `+${contains.replace(' ', '+')}`.replace('++', '+');
        const query = (await connection.query(
            'SELECT *  FROM numbers INNER JOIN usersPhones ON numbers.numberId=usersPhones.numberId WHERE userId=? AND number=?;',
            [[user.userId], [validNumber]]
        )) as any[];

        return query[0][0];
    }

    static async getUserAlbums(user: User): Promise<Album[]> {
        const query = (await connection.query('SELECT * FROM albums WHERE userId=?', [[user.userId!]])) as any[];
        return query[0];
    }

    static async countUserPhotos(user: User): Promise<number> {
        const userAlbums = await User.getUserAlbums(user);
        const photoAmounts = await Promise.all(
            userAlbums.map(async (album) => {
                const amount = await Album.countPhotos(album);
                return amount;
            })
        );
        return photoAmounts.reduce((prev, next) => prev + next, 0);
    }

    static async photosUntilWaterMark(user: User): Promise<number> {
        const photoAmount = await User.countUserPhotos(user);
        return photoAmount - 3;
    }
}
