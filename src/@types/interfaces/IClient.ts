export interface IClient {
    clientId?: number;
    number: string;
    selfieLink?: string;
    selfieFolder?: string;
    name?: string;
    email?: string;
    token: string;
    expires: Date;
}
