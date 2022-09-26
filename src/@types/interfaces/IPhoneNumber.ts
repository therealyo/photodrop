import { RowDataPacket } from 'mysql2/promise';

export interface IPhoneNumber {
    readonly number: string;
    readonly userId: number;
    // readonly photoId: number;
    // photos: string[]
}
