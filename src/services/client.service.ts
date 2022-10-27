import { Otp } from './../@types/Otp'
import otpService from './otp.service'
import tokenService from './token.service'
import presignedUrlService from './presignedUrl.service'
import { ApiError } from './../errors/api.error'
import { Client } from '../models/Client'
import { Photo } from '../models/Photo'
import { PresignedUrl } from '../@types/PresignedUrl'
import albumService from './album.service'
import { getQueryResult } from '../libs/queryResult'
import { Album } from '../models/Album'
import connection from '../connectors/sql.connector'
import photoService from './photo.service'

class ClientService {
    private async sendOtp(number: string, otp: Otp) {
        await otpService.sendOtp(number, otp).catch((err) => {
            console.log(err)
        })
        return number
    }

    private async updateOtp(client: Client, otp: Otp): Promise<void> {
        await connection.query('UPDATE clients SET token=?, expires=? WHERE clientId=?', [
            [otp.token],
            [otp.expires],
            [client.clientId]
        ])
    }

    private async setNewNumber(client: Client, number: string): Promise<void> {
        await connection.query('UPDATE clients SET newNumber=? WHERE clientId=?', [[number], [client.clientId]])
    }

    private async verifyChangeNumber(client: Client, number: string): Promise<boolean> {
        const result = getQueryResult(
            await connection.query('SELECT newNumber FROM clients WHERE clientId=?', [[client.clientId]])
        )
        const newNumber = result[0].newNumber
        return number === newNumber
    }

    private async changeNumber(client: Client, number: string): Promise<void> {
        await connection.query('UPDATE clients SET number=?, newNumber="undefined" WHERE clientId=?', [
            [number],
            client.clientId
        ])
    }

    async createClient(number: string, newNumber?: string): Promise<string> {
        const otp = await otpService.generateOtp()

        const client = await this.getClient(number)

        if (client) {
            await this.updateOtp(client, otp)
            if (newNumber) {
                await this.setNewNumber(client, newNumber)
                return await this.sendOtp(newNumber, otp)
            }
        } else {
            if (newNumber) throw ApiError.BadRequest('User does not exist')
            else {
                const newClient = new Client(number)
                await newClient.save()
                await this.updateOtp(newClient, otp)
            }
        }

        return await this.sendOtp(number, otp)
    }

    async verifyClient(number: string, code: string, newNumber?: string): Promise<string | undefined> {
        const verified = await otpService.verifyOtp(number, code)
        if (verified) {
            const client = await this.getClient(number)
            if (newNumber) {
                if (await this.getClient(newNumber)) {
                    throw ApiError.BadRequest('Cannot change number. User with such number already exists')
                }
                if (await this.verifyChangeNumber(client!, newNumber)) {
                    await this.changeNumber(client!, newNumber)
                    return 'Number changed'
                } else {
                    throw ApiError.BadRequest('New number not verified')
                }
            } else {
                return await tokenService.generateToken(client!)
            }
        }
    }

    async setPersonalData(client: Client, name: string | undefined, email: string | undefined) {
        await connection.query('UPDATE clients SET name=?, email=? WHERE clientId=?', [
            [name],
            [email],
            [client.clientId]
        ])
    }

    async getClient(number: string): Promise<Client | undefined> {
        const clientData = getQueryResult(await connection.query('SELECT * FROM clients WHERE number=?', [[number]]))[0]
        return clientData
    }

    async setSelfie(client: Client): Promise<PresignedUrl> {
        const selfieName = await photoService.generateName()
        const link = await presignedUrlService.getPresignedUrlUpload(`selfies/${client.clientId}/${selfieName}`)
        return link
    }

    private async getAlbums(client: Client): Promise<string[]> {
        const clientAlbumsIds = getQueryResult(
            await connection.query('SELECT DISTINCT albumId FROM numbersOnPhotos WHERE clientId;', [client.clientId])
        )
        return clientAlbumsIds.map(({ albumId }) => {
            return albumId
        })
    }

    async getClientAlbums(client: Client) {
        const purchasedAlbums = await this.getPurchasedAlbums(client)

        return await Promise.all(
            (
                await this.getAlbums(client)
            ).map(async (albumId) => {
                const purchased = purchasedAlbums.includes(albumId)
                return { purchased, ...(await albumService.getAlbumData(albumId)) }
            })
        )
    }

    async purchase(clientId: string, albumId: string) {
        await connection.query(
            `INSERT IGNORE INTO clientsAlbums (clientId, albumId) VALUES ('${clientId}', '${albumId}')`
        )
    }

    async getPurchasedAlbums(client: Client) {
        const res = getQueryResult(
            await connection.query('SELECT albumId FROM clientsAlbums WHERE clientId=?', [[client.clientId]])
        )

        return res
            ? res.map(({ albumId }) => {
                  return albumId
              })
            : []
    }

    async checkPurchased(client: Client, albumId: string) {
        const clientAlbums = await this.getPurchasedAlbums(client)
        if (clientAlbums.includes(albumId)) {
            return true
        }

        return false
    }

    private async getAlbumPhotos(client: Client, album: Album) {
        return getQueryResult(
            await connection.query(
                `SELECT 
                    photos.photoId as photoId, 
                    photos.albumId as albumId, 
                    photos.extension as extension 
                FROM photos 
                    LEFT JOIN numbersOnPhotos 
                        ON photos.photoId=numbersOnPhotos.photoId 
                            WHERE numbersOnPhotos.clientId="${client.clientId}" AND numbersOnPhotos.albumId="${album.albumId}"`
            )
        )
    }

    async getAlbumPhotosWithoutWatermark(client: Client, album: Album) {
        const photos = await this.getAlbumPhotos(client, album)
        return await Promise.all(
            photos.map(async (photo: Photo) => {
                return {
                    original: await presignedUrlService.getPresignedUrlRead(
                        `${album.path}${photo.photoId}.${photo.extension}`
                    ),
                    thumbnail: await presignedUrlService.getPresignedUrlRead(
                        `thumbnail/${album.path}${photo.photoId}.${photo.extension}`
                    )
                }
            })
        )
    }

    async getAlbumPhotosWithWatermark(client: Client, album: Album) {
        const photos = await this.getAlbumPhotos(client, album)
        return await Promise.all(
            photos.map(async (photo: Photo) => {
                return {
                    original: await presignedUrlService.getPresignedUrlRead(
                        `watermark/${album.path}${photo.photoId}.${photo.extension}`
                    ),
                    thumbnail: await presignedUrlService.getPresignedUrlRead(
                        `thumbnail/watermark/${album.path}${photo.photoId}.${photo.extension}`
                    )
                }
            })
        )
    }

    async getClientAlbumData(client: Client, albumId: string) {
        const albums = await this.getAlbums(client)
        if (albums.includes(albumId)) {
            const album = await albumService.getAlbumData(albumId)
            // const photos = await this.getAlbumPhotos(client, album)

            const purchased = await this.checkPurchased(client, albumId)

            return {
                purchased,
                ...album,
                photos: purchased
                    ? await this.getAlbumPhotosWithoutWatermark(client, album)
                    : await this.getAlbumPhotosWithWatermark(client, album)
            }
        } else {
            throw new ApiError(404, 'Album does not exist')
        }
    }
}

export default new ClientService()
