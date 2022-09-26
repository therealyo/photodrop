import { RowDataPacket } from 'mysql2/promise';

export interface IPhoneNumber {
    readonly countryCode: string;
    readonly phoneNumber: string;
    readonly userId?: number;
    readonly number?: string;
    // readonly photoId: number;
    // photos: string[]
}
