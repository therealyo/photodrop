import { middyfy } from '../../../libs/lambda'
import { getPresignedUrlSchema } from '../../../validation/photo.validation'
import { handleError } from './../../../errors/errorHandler'
import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from './../../../libs/api-gateway'
import { User } from '../../../models/User'
import photoService from '../../../services/photo.service'
import presignedUrlService from '../../../services/presignedUrl.service'

const presignedUrlHanlder: ValidatedEventAPIGatewayProxyEvent<typeof getPresignedUrlSchema> = async (event: any) => {
    try {
        const { albumId } = event.pathParameters
        const { extension } = event.body

        const user = JSON.parse(event.requestContext.authorizer.user) as User
        const photoName = await photoService.generateName()

        const uploadData = await presignedUrlService.getPresignedUrlUpload(
            `albums/${user.userId}/${albumId}/${photoName}.${extension}`
        )

        return formatJSONResponse(200, { data: { key: `${photoName}`, ...uploadData } })
    } catch (err) {
        const e = handleError(err)
        return formatJSONResponse(e.statusCode, e.body)
    }
}

export const getPresignedUrl = middyfy(presignedUrlHanlder, getPresignedUrlSchema)
