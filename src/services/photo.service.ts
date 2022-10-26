import { promisify } from 'util'
import * as crypto from 'crypto'

import { User } from '../models/User'
import { Client } from '../models/Client'
import clientService from './client.service'
import connection from '../connectors/sql.connector'
import phoneNumberService from './phoneNumber.service'
import userService from './user.service'
import { ApiError } from '../errors/api.error'
import { Photo } from '../models/Photo'

const randomBytes = promisify(crypto.randomBytes)

class PhotoService {
    async saveNumbers(user: User, albumId: string, numbers: string[], photos: string[]) {
        const clients = await Promise.all(
            numbers.map(async (number) => {
                const client = await clientService.getClient(number)
                if (client) {
                    return client
                }
                return new Client(number)
            })
        )
        await phoneNumberService.save(user, clients)
        await this.savePhotoNumbersRelation(albumId, photos, clients)
    }

    async processFileName(photo: Photo) {
        const split = photo.fileName.split('/')
        const userName = split[1].replace('%40', '@')

        if (split[0] === 'albums') {
            const user = await userService.getUserData(userName)
            photo.userId = user.userId
            photo.albumId = split[2]
            const [name, ext] = split[3].split('.')
            photo.photoId = name
            photo.extension = ext
        } else if (split[0] === 'selfies') {
            photo.userId = split[1]
            photo.photoId = split[2]
        } else {
            throw new ApiError(500, 'Something wrong with photo loading')
        }
    }

    async generateName(): Promise<string> {
        const rawBytes = await randomBytes(16)
        const photoName = rawBytes.toString('hex')
        return photoName
    }

    createPhotoNumbersRelations(albumId: string, photo: string, clients: Client[]) {
        return clients.map((client) => {
            return [photo, client.clientId, albumId]
        })
    }

    async savePhotoNumbersRelation(albumId: string, photos: string[], clients: Client[]): Promise<void> {
        const relations = photos
            .map((photo) => {
                return this.createPhotoNumbersRelations(albumId, photo, clients)
            })
            .flat()

        try {
            await connection.query('INSERT INTO numbersOnPhotos (photoId, clientId, albumId) VALUES ?;', [relations])
        } catch (err) {
            throw err
        }
    }
}

export default new PhotoService()
