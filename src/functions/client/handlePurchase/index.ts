import { handlerPath } from "../../../libs/handler-resolver";

export const handlePurchase = {
    handler: `${handlerPath(__dirname)}/handler.handlePurchase`,
    events: [
        {
            http: {
                method: "post",
                path: "client/handlePurchase",
                cors: true
            }
        }
    ]
}