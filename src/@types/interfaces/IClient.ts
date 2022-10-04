export interface IClient {
    clientId?: string;
    number: string;
    selfieLink?: string;
    selfieFolder?: string;
    name?: string;
    email?: string;
    token: string;
    expires: Date;
}
