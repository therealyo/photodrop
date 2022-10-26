import { v4 as uuidv4 } from 'uuid'

import connection from '../connectors/sql.connector'

export class Client {
    clientId?: string
    number: string
    selfieLink?: string
    selfie?: string
    name?: string
    email?: string
    token: string
    expires: Date

    constructor(number: string) {
        this.clientId = uuidv4()
        this.number = number
    }

    async save(): Promise<void> {
        await connection.query(
            'INSERT IGNORE INTO clients (clientId, number, name, email, selfieLink, token, expires) VALUES (?)',
            [[this.clientId, this.number, this.name, this.email, this.selfieLink, this.token, this.expires]]
        )
    }
}
