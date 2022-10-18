import { handleError } from "../../../errors/errorHandler";
import { formatJSONResponse } from "../../../libs/api-gateway";
import clientService from "../../../services/client.service";

export const handlePurchase = async (event) => {
    try {
        const stripeEvent = JSON.parse(event.body);

        const { albumId, clientId } = stripeEvent.data.object.metadata

        await clientService.handlePurchase(clientId, albumId)
        return formatJSONResponse(200, {
            data: {
                albumId,
                clientId
            }
        })

    } catch (err) {
        const e = handleError(err);
        return formatJSONResponse(e.statusCode, e.body);
    }
}
