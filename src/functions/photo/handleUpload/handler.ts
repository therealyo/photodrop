import { Photo } from '../../../models/Photo'
import photoService from '../../../services/photo.service'

export const saveUpload = async (event: any) => {
    const fileName = event.Records[0].s3.object.key as string
    
    if (!(fileName.includes('thumbnail') || fileName.includes("watermark"))) {
        const photo = new Photo(fileName)
        await photoService.processFileName(photo)

        if (photo.albumId) {
            await photo.saveAlbumPhoto()
            await photoService.generateCopies(fileName)
        }

        await photo.saveSelfie()
    }
}
