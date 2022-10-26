import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export function getQueryResult(
    query: [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]
): any[] {
    return JSON.parse(JSON.stringify(query))[0];
}
