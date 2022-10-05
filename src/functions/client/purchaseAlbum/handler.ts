// import { formatJSONResponse } from './../../../libs/api-gateway';
// import Stripe from 'stripe';
import { handleError } from './../../../errors/errorHandler';
import { middyfy } from '../../../libs/lambda';
import { stripe } from '../../../connectors/stripe';
import { Client } from '../../../models/Client';
// import albumService from '../../../services/album.service';
import clientService from '../../../services/client.service';

export const purchaseAlbum = async (event, context, callback) => {
    try {
        const { albumId } = event.pathParameters;
        const user = JSON.parse(event.requestContext.authorizer.user) as Client;
        const albumData = await clientService.getClientAlbumData(user, albumId);

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: albumData.name,
                            metadata: {
                                albumId
                            }
                        },
                        unit_amount: 500
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `https://example.com?success=true`,
            cancel_url: `https://example.com/?canceled=true`
        });
        console.log(session);
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
                // Location: session.url
            },
            body: JSON.stringify({ url: session.url })
        };
        // console.log(response);
        return response;
        // console.log(customer.id);
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message })
        };
    }
};

// export const purchaseAlbum = middyfy(purchaseHandler);
