import AWS from 'aws-sdk'
import mime from 'mime-types'
import sharp from 'sharp'
import axios from 'axios'
import sizeOf from 'buffer-image-size'
import { promisify } from 'util'
import * as crypto from 'crypto'
import * as dotenv from 'dotenv'

import { User } from '../models/User'
import { Client } from '../models/Client'
import clientService from './client.service'
import connection from '../connectors/sql.connector'
import phoneNumberService from './phoneNumber.service'
import userService from './user.service'
import { Photo } from '../models/Photo'
import presignedUrlService from './presignedUrl.service'

dotenv.config()

const randomBytes = promisify(crypto.randomBytes)
type Size = { width: number; height: number }
type PhotoData = {
    size: Size,
    contentType: string
}

class PhotoService {
    private watermark: Buffer

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

    private async downloadOriginal(photoName: string): Promise<Buffer> {
        const s3 = new AWS.S3({ apiVersion: '2006-03-01' })
        const params = { Bucket: process.env.BUCKET_NAME, Key: photoName.replace('%40', '@') }
        return (await s3.getObject(params).promise()).Body as Buffer
    }

    private async downloadWatermark(): Promise<void> {
        const request = await axios.get(process.env.WATERMARK, {
            responseType: 'arraybuffer'
        })

        this.watermark = Buffer.from(request.data, 'utf-8')
    }

    private getPhotoData(photo: Buffer): PhotoData {
        const { type: ext, ...size } = sizeOf(photo)
        const contentType = mime.contentType(ext) as string
        return {
            contentType,
            size
        }
    }

    private async addWatermark(photo: Buffer, watermark: Buffer): Promise<Buffer> {
        return await sharp(photo)
            .composite([{ input: watermark, gravity: 'center' }])
            .sharpen()
            .toBuffer()
    }

    private async resizeWatermark(watermark: Buffer, size: Size): Promise<Buffer> {
        return await sharp(watermark)
            .resize({
                height: Math.ceil(size.height * 0.304),
                width: Math.ceil(size.width * 0.616)
            })
            .toBuffer()
    }

    private async createThumbnail(photo: Buffer): Promise<Buffer> {
        return await sharp(photo)
            .resize({
                width: 400,
                height: 400
            })
            .toBuffer()
    }

    private async uploadPhoto(photo: Buffer, key: string): Promise<void> {
        const photoData = this.getPhotoData(photo)
        await presignedUrlService.upload({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: photo,
            ACL: 'public-read',
            ContentType: photoData.contentType
        })
    }

    private async uploadPhotoWithWatermark(photo: Buffer, key: string): Promise<void> {
        const photoData = this.getPhotoData(photo)
        const resizedWatermark = await this.resizeWatermark(this.watermark, photoData.size)
        const photoWithWatermark = await this.addWatermark(photo, resizedWatermark)

        await this.uploadPhoto(photoWithWatermark, key)
    }

    private async saveThumbnail(thumbnail: Buffer, photoName: string): Promise<void> {
        await this.uploadPhoto(thumbnail, `thumbnail/${photoName}`)
    }

    private async saveThumbnailWithWatermark(thumbnail: Buffer, photoName: string): Promise<void> {
        await this.uploadPhotoWithWatermark(thumbnail, `thumbnail/watermark/${photoName}`)
    }

    private async saveOriginalWithWatermark(original: Buffer, photoName: string): Promise<void> {
        await this.uploadPhotoWithWatermark(original, `watermark/${photoName}`)
    }

    async generateCopies(photoName: string): Promise<void> {
        const originalPhoto = await this.downloadOriginal(photoName)
        const thumbnail = await this.createThumbnail(originalPhoto)
        await this.downloadWatermark()

        await Promise.all([
            this.saveThumbnail(thumbnail, photoName),
            this.saveThumbnailWithWatermark(thumbnail, photoName),
            this.saveOriginalWithWatermark(originalPhoto, photoName)
        ])
    }
}

export default new PhotoService()
