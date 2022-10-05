import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET, {
    apiVersion: '2022-08-01'
});
