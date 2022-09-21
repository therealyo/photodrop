import { parsePhoneNumber } from 'libphonenumber-js';
import { ParsedNumber } from '../@types/ParsedNumber';

class PhoneService {
    splitNumber(phoneNumber: string): ParsedNumber | undefined {
        const parsedNumber = parsePhoneNumber(phoneNumber);
        return {
            countryCode: `+${parsedNumber.countryCallingCode}`,
            number: parsedNumber.nationalNumber
        };
    }

    concatNumber(number: { countryCode: string; number: string }): string | undefined {
        try {
            return number.countryCode + number.number;
        } catch (err) {}
    }
}

export default new PhoneService();
