export class PhoneNumber {
    countryCode: string;
    phoneNumber: string;
    userId?: number;
    number?: string;

    constructor(countryCode: string, number: string, userId?: number) {
        this.countryCode = countryCode;
        this.phoneNumber = number;
        this.userId = userId;
    }
}
