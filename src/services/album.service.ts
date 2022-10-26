import * as dotenv from 'dotenv'

import { ApiError } from './../errors/api.error'
import connection from '../connectors/sql.connector'
import { Album } from '../models/Album'
import { User } from '../models/User'
import { getQueryResult } from '../libs/queryResult'
import { PhotoId } from '../@types/PhotoId'

dotenv.config()

class AlbumService {
    async getAlbumPhotos(albumId: string): Promise<PhotoId[]> {
        const result = getQueryResult(
            await connection.query('SELECT photoId, extension FROM photos WHERE albumId=?', [[albumId]])
        )
        return result
    }

    async getAlbumData(albumId: string): Promise<Album> {
        const result = getQueryResult(await connection.query(`SELECT * FROM albums WHERE albumId=?`, [[albumId]]))
        return result[0]
    }

    async createAlbum(user: User, name: string, location: string, date: string | undefined): Promise<Album> {
        const album = new Album(name, user, location, date)
        const albumData = await album.save()
        return albumData
    }

    async getAlbum(user: User, albumId: string) {
        const albumData = await this.getAlbumData(albumId)
        if (user.userId === albumData.userId) {
            if (albumData) {
                const albumPhotos = await this.getAlbumPhotos(albumData.albumId!)
                const photos = albumPhotos.map((photo) => {
                    return {
                        url: `${process.env.BUCKET_PATH}${albumData.path}${photo.photoId}.${photo.extension}`
                    }
                })
                return {
                    albumId: albumData.albumId,
                    name: albumData.name,
                    location: albumData.location,
                    date: albumData.date,
                    photos: photos
                }
            } else {
                throw ApiError.NotFound('album not found')
            }
        } else {
            throw ApiError.UnauthorizedError()
        }
    }
}

export default new AlbumService()
