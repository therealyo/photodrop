import { ApiError } from './../errors/api.error'
import * as crypto from 'crypto'
import { promisify } from 'util'
import { PhoneNumber } from './PhoneNumber'
import connection from '../connectors/sql.connector'
import { User } from './User'
import { Client } from './Client'

const randomBytes = promisify(crypto.randomBytes)
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

    async processFileName() {
        const split = this.fileName.split('/')
        const userName = split[1].replace('%40', '@')

        if (split[0] === 'albums') {
            const user = await User.getUserData(userName)
            this.userId = user.userId
            this.albumId = split[2]
            const [name, ext] = split[3].split('.')
            this.photoId = name
            this.extension = ext
        } else if (split[0] === 'selfies') {
            this.userId = split[1]
            this.photoId = split[2]
        } else {
            throw new ApiError(500, 'Something wrong with photo loading')
        }
    }

    async saveAlbumPhoto() {
        await connection.query('INSERT INTO photos (photoId, albumId, extension) VALUES (?)', [
            [this.photoId, this.albumId, this.extension]
        ])
    }

    async saveSelfie() {
        await connection.query(`UPDATE clients SET selfieLink='${this.photoId}' WHERE clientId='${this.userId}'`)
    }

    async setName(): Promise<void> {
        this.photoId = await Photo.generateName()
    }

    static async generateName(): Promise<string> {
        const rawBytes = await randomBytes(16)
        const photoName = rawBytes.toString('hex')
        return photoName
    }

    static async savePhotoNumbersRelation(albumId: string, photos: string[], clients: Client[]): Promise<void> {
        const relations = photos
            .map((photo) => {
                return Photo.createPhotoNumbersRelations(albumId, photo, clients)
            })
            .flat()

        try {
            await connection.query('INSERT INTO numbersOnPhotos (photoId, clientId, albumId) VALUES ?;', [relations])
        } catch (err) {
            throw err
        }
    }

    static createPhotoNumbersRelations(albumId: string, photo: string, clients: Client[]) {
        return clients.map((client) => {
            return [photo, client.clientId, albumId]
        })
    }
}
