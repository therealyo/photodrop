import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
dotenv.config();

import { Client } from '../models/Client';
import { Otp } from '../@types/Otp';
import tokenService from './token.service';
import { ApiError } from '../errors/api.error';

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, { polling: true });

class OtpService {
    async generateOtp(): Promise<Otp> {
        const token = this.generateToken();
        return {
            token: token,
            expires: new Date(new Date().getTime() + 3 * 60000)
        };
    }

    async sendOtp(number: string, otp: Otp): Promise<void> {
        await bot.sendMessage(process.env.CHAT_ID!, `${number}: ${otp.token}`);
    }

    async verifyOtp(number: string, code: string): Promise<string | undefined> {
        const client = await Client.getData(number);

        if (client) {
            if (client.token === code && this.compareDates(new Date(), new Date(client.expires))) {
                return await tokenService.generateToken(client);
            } else {
                throw ApiError.VerificationError();
            }
        } else {
            throw new ApiError(401, 'Wrong phone number');
        }
    }

    compareDates(currentDate: Date, expires: Date): boolean {
        return currentDate < expires;
    }

    generateToken(): string {
        const token = Math.floor(100000 + Math.random() * 900000);
        return token.toString();
    }
}

export default new OtpService();
