import { handleError } from './../../../errors/errorHandler';
import { stripe } from '../../../connectors/stripe';
import { Client } from '../../../models/Client';
import clientService from '../../../services/client.service';
import { formatJSONResponse } from '../../../libs/api-gateway';

export const purchaseAlbum = async (event) => {
    try {
        const { albumId } = event.pathParameters;
        const user = JSON.parse(event.requestContext.authorizer.user) as Client;
        const albumData = await clientService.getClientAlbumData(user, albumId);

        console.log(albumId);

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: albumData.name,
                            
                        },
                        unit_amount: 500
                    },
                    quantity: 1
                }
            ],
            metadata: {
                albumId: albumId,
                clientId: user.clientId
            },
            mode: 'payment',
            success_url: `https://example.com?success=true`,
            cancel_url: `https://example.com?canceled=true`
        });

        return formatJSONResponse(200, { url: session.url });
        // console.log(customer.id);
    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
};

// export const purchaseAlbum = middyfy(purchaseHandler);
