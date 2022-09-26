import { Otp } from '../Otp';

export interface IClient {
    readonly clientId?: number;
    readonly number: string;
    readonly selfieLink?: string;
    readonly selfieFolder?: string;
    readonly name?: string;
    readonly email?: string;
    token: string;
    expires: Date;
}
