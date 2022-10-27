import { PhoneNumber } from './PhoneNumber'
import connection from '../connectors/sql.connector'
import photoService from '../services/photo.service'
import albumService from '../services/album.service'

export class Photo {
    photoId?: string
    albumId?: string
    userId?: string
    numbers?: PhoneNumber[]
    extension?: string
    fileName: string

    constructor(fileName: string) {
        this.fileName = fileName
        this.albumId = null
    }

    async saveAlbumPhoto() {
        if (!await albumService.getCover(this.albumId)) {
            await albumService.setCover(this.albumId, `${this.photoId}.${this.extension}`)
        }
        await connection.query('INSERT INTO photos (photoId, albumId, extension) VALUES (?)', [
            [this.photoId, this.albumId, this.extension]
        ])
    }

    async saveSelfie() {
        await connection.query(`UPDATE clients SET selfieLink='${this.photoId}' WHERE clientId='${this.userId}'`)
    }

    async setName(): Promise<void> {
        this.photoId = await photoService.generateName()
    }
}
