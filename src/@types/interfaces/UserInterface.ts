export interface UserInterface {
    readonly login: string;
    readonly password: string;
    readonly userId?: number;
    readonly email?: string;
    readonly fullName?: string;
    save(): Promise<string>;
    // exists(login: string): Promise<boolean>;
    // checkPassword(password: string): Promise<boolean>;
}