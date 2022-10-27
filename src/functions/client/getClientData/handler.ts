import { Handler } from 'aws-lambda'

import { formatJSONResponse } from './../../../libs/api-gateway'
import { middyfy } from './../../../libs/lambda'
import { handleError } from './../../../errors/errorHandler'
import clientService from '../../../services/client.service'
import { Client } from '../../../models/Client'
import presignedUrlService from '../../../services/presignedUrl.service'

const getClientHandler: Handler = async (event: any) => {
    try {
        const user = JSON.parse(event.requestContext.authorizer.user) as Client
        const userData = await clientService.getClient(user.number)

        return formatJSONResponse(200, {
            data: {
                number: userData!.number,
                email: userData!.email,
                name: userData!.name,
                selfie: userData!.selfieLink
                    ? await presignedUrlService.getPresignedUrlRead(`selfies/${userData!.clientId}/${userData!.selfieLink}`)
                    : null
            }
        })
    } catch (err) {
        const e = handleError(err)
        return formatJSONResponse(e.statusCode, e.body)
    }
}

export const getClient = middyfy(getClientHandler)
