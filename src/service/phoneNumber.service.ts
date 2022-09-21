import { parsePhoneNumber } from 'libphonenumber-js';

class PhoneService {
    splitNumber(phoneNumber: string) {
        const parsedNumber = parsePhoneNumber(phoneNumber);
        return {
            countryCode: `+${parsedNumber.countryCallingCode}`,
            number: parsedNumber.nationalNumber
        };
    }

    concatNumber(number: { countryCode: string; number: string }) {
        try {
            return number.countryCode + number.number;
        } catch (err) {}
    }
}

export default new PhoneService();
