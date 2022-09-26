import { IPhoneNumber } from './IPhoneNumber';

export interface IPhoto {
    readonly name?: string;
    readonly albumId?: number;
    readonly link?: string;
    readonly userId?: number;
    readonly waterMark: boolean;
    numbers?: IPhoneNumber[];
}
